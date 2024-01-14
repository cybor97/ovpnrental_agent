import { inspect } from "util";
import { NatsConnection, Subscription, connect, jwtAuthenticator } from "nats";
import { CreateCommand } from "./commands/create";
import { DeleteCommand } from "./commands/delete";
import { ListCommand } from "./commands/list";
import { RevokeCommand } from "./commands/revoke";
import { ShowCommand } from "./commands/show";
import config from "./config";
import { CertCommandPayloadNATS, CertCommandStatus } from "./types";
import { statusUpdate } from "./utils/nats";
import { getMyIp } from "./utils/net";
import logger from "./utils/logger";

const certCommands = {
  create: new CreateCommand(),
  list: new ListCommand(),
  show: new ShowCommand(),
  revoke: new RevokeCommand(),
  delete: new DeleteCommand(),
};

async function main(): Promise<void> {
  const localIp = await getMyIp();
  const natsConnection = await connect({
    servers: config.natsServer,
    authenticator: jwtAuthenticator(
      config.natsJwt as string,
      Buffer.from(config.natsNkeySeed as string)
    ),
  });
  logger.info(`[main] Connected to ${natsConnection.getServer()}...`);

  const subscriptions: Subscription[] = [];
  for (const cmd in certCommands) {
    logger.info(`[main] Registering command ${cmd}...`);
    subscriptions.push(natsConnection.subscribe(`cert.${cmd}`));
  }
  const promises = subscriptions.map((s) =>
    runEventHandler(natsConnection, localIp, s)
  );
  logger.info("[main] Initializing commands...");

  await Promise.all(promises);
}

async function runEventHandler(
  natsConnection: NatsConnection,
  localIp: string,
  sub: Subscription
): Promise<void> {
  const subject = sub.getSubject();
  const command = subject.split(".")[1] as keyof typeof certCommands;
  while (true) {
    for await (const msg of sub) {
      const { clientName } = msg.json<CertCommandPayloadNATS>();
      statusUpdate(natsConnection, subject, {
        clientName,
        status: CertCommandStatus.PROCESSING,
      });
      try {
        const data = await certCommands[command].run({
          ip: localIp,
          clientName,
        });
        statusUpdate(natsConnection, subject, {
          clientName,
          status: CertCommandStatus.SUCCESS,
          data
        });
      } catch (err) {
        statusUpdate(natsConnection, subject, {
          clientName,
          status: CertCommandStatus.FAILURE
        });
        logger.error(
          `[runEventHandler][${subject}] Error running command ${command}. ${inspect(
            err
          )}`
        );
      }
    }
  }
}

main();
