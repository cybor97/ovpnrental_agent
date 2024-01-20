// delete from /etc/openvpn/easy-rsa/

import { ICommand } from "./types/ICommand";

export class DeleteCommand extends ICommand {
  public async run(opts: { clientName: string }): Promise<void> {
    throw new Error("Command not implemented.");
  }
}
