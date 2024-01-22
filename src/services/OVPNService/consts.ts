import { CreateCommand } from "./commands/create";
import { DeleteCommand } from "./commands/delete";
import ListCommand from "./commands/list";
import NudgeCommand from "./commands/nudge";
import { RevokeCommand } from "./commands/revoke";
import { ShowCommand } from "./commands/show";
import { CertCommand } from "./types";

export const CERT_COMMANDS = {
  [CertCommand.create]: new CreateCommand(),
  [CertCommand.list]: new ListCommand(),
  [CertCommand.show]: new ShowCommand(),
  [CertCommand.revoke]: new RevokeCommand(),
  [CertCommand.delete]: new DeleteCommand(),
  [CertCommand.nudge]: new NudgeCommand(),
};
