// ./easyrsa revoke test_omit_scripts unspecified <<< $'yes\n'
// ./easyrsa gen-crl

import { join } from "path";
import { executeCommand } from "../utils/shell";
import { ICommand } from "./types/ICommand";

export class RevokeCommand extends ICommand {
  public async run(opts: { clientName: string }): Promise<void> {
    const { clientName } = opts;
    try {
      await executeCommand(
        join(this.rsaDirectory, "easyrsa"),
        "revoke",
        clientName,
        "unspecified",
        "<<<",
        "$'yes\n'"
      );
    } catch (error) {
      console.error(`Error building client ${clientName}`, error);
      throw new Error(`Error building client ${clientName}`);
    }
  }
}
