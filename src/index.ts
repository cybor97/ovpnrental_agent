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
  console.log(`Connected to ${natsConnection.getServer()}...`);

  const subscriptions: Subscription[] = [];
  for (const cmd in certCommands) {
    console.log(`Registering command ${cmd}...`);
    subscriptions.push(natsConnection.subscribe(`cert.${cmd}`));
  }
  await Promise.all(
    subscriptions.map((s) => runEventHandler(natsConnection, localIp, s))
  );
}

async function runEventHandler(
  natsConnection: NatsConnection,
  localIp: string,
  sub: Subscription
): Promise<void> {
  const subject = sub.getSubject();
  const command = subject.split(".")[1] as keyof typeof certCommands;
  for await (const msg of sub) {
    const { clientName } = msg.json<CertCommandPayloadNATS>();
    statusUpdate(natsConnection, subject, {
      clientName,
      status: CertCommandStatus.PROCESSING,
    });
    try {
      await certCommands[command].run({
        ip: localIp,
        clientName,
      });
      statusUpdate(natsConnection, subject, {
        clientName,
        status: CertCommandStatus.SUCCESS,
      });
    } catch (err) {
      statusUpdate(natsConnection, subject, {
        clientName,
        status: CertCommandStatus.FAILURE,
      });
      console.error(err);
    }
  }
}

main();
