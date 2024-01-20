import { inspect } from "util";
import config from "./config";
import {
  CertCommandPayloadSQS,
  CertCommandStatus,
  MQCertCommand,
} from "./types";
import logger from "./utils/logger";
import { SQSService } from "./services/SQSService";
import { OVPNService } from "./services/OVPNService";

async function main(): Promise<void> {
  logger.info("[main] Starting...");
  const sqs = config.sqs;
  const { region, endpoint, accessKeyId, secretAccessKey } = sqs;
  const sqsManager = SQSService.getService({
    region,
    endpoint,
    accessKeyId,
    secretAccessKey,
    emitterQueueUrl: sqs.agentQueueUrl,
    consumerQueueUrl: sqs.appQueueUrl,
  });
  const ovpnManager = await OVPNService.getService();
  const mqCertCommands = Object.values(MQCertCommand) as MQCertCommand[];
  sqsManager.initEmitter(...mqCertCommands.map((key) => `${key}.update`));
  sqsManager.initConsumer(...mqCertCommands);

  for (const command of mqCertCommands) {
    logger.info(`[main] Registering command ${command}`);
    sqsManager.eventEmitter.on(command, (payload: CertCommandPayloadSQS) => {
      void handleEvent(sqsManager, ovpnManager, command, payload);
    });
  }
  logger.info("[main] Init complete");
}

async function handleEvent(
  sqsManager: SQSService,
  ovpnManager: OVPNService,
  command: MQCertCommand,
  payload: CertCommandPayloadSQS
): Promise<void> {
  const { clientName } = payload;
  sqsManager.eventEmitter.emit(`${command}.update`, {
    status: CertCommandStatus.PROCESSING,
    clientName,
  });
  try {
    const data = await ovpnManager.runCommand(`${command}`, { clientName });
    sqsManager.eventEmitter.emit(`${command}.update`, {
      status: CertCommandStatus.SUCCESS,
      clientName,
      data,
    });
  } catch (error) {
    sqsManager.eventEmitter.emit(`${command}.update`, {
      status: CertCommandStatus.FAILURE,
      clientName,
    });

    logger.error(
      `[handleEvent][${command}] Error running command ${command}. ${inspect(
        error
      )}`
    );
  }
}

main();
