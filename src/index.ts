import { CreateCommand } from "./commands/create";
import { DeleteCommand } from "./commands/delete";
import { ListCommand } from "./commands/list";
import { RevokeCommand } from "./commands/revoke";
import { ShowCommand } from "./commands/show";
import { getMyIp } from "./utils/net";

const commands = {
  create: new CreateCommand(),
  list: new ListCommand(),
  show: new ShowCommand(),
  revoke: new RevokeCommand(),
  delete: new DeleteCommand(),
};

async function main(): Promise<void> {
  const ip = await getMyIp();
  const clientName = process.argv.at(-1) as string;
  const command = process.argv.at(-2) as keyof typeof commands;
  const result = await commands[command].run({ ip, clientName });
  console.log({ result });
}

main();
