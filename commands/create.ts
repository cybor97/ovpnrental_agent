import { join } from "path";
import { executeCommand } from "../utils/shell";
import { ICommand } from "./types/ICommand";

export class CreateCommand extends ICommand {
  public async run(opts: { clientName: string }): Promise<void> {
    const { clientName } = opts;
    try {
      await executeCommand(
        join(this.rsaDirectory, "easyrsa"),
        "build-client-full",
        clientName,
        "nopass"
      );
    } catch (error) {
      console.error(`Error building client ${clientName}`, error);
      throw new Error(`Error building client ${clientName}`);
    }
  }
}
