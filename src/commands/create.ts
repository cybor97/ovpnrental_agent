import logger from "../utils/logger";
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
      const commonData = err + data;
      if (
        commonData.includes("Signature ok") &&
        commonData.includes("Data Base Updated")
      ) {
        return;
      }
      if (err) {
        throw new Error(err);
      }
    } catch (error) {
      logger.error(
        `[CreateCommand][run] Error building client ${clientName}`,
        error
      );
      throw new Error(`Error building client ${clientName}`);
    }
  }
}
