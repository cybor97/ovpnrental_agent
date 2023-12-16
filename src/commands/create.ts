import { executeCommand } from "../utils/shell";
import { ICommand } from "./types/ICommand";

export class CreateCommand extends ICommand {
  public async run(opts: { clientName: string }): Promise<void> {
    const { clientName } = opts;
    try {
      const [err, data] = await executeCommand(this.rsaDirectory, "./easyrsa", [
        "build-client-full",
        clientName,
        "nopass",
      ]);
      if (data.includes("Signature ok") && data.includes("Data Base Updated")) {
        return;
      }
      if (err) {
        throw new Error(err);
      }
    } catch (error) {
      console.error(`Error building client ${clientName}`, error);
      throw new Error(`Error building client ${clientName}`);
    }
  }
}
