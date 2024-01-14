import logger from "../utils/logger";
import { executeCommand } from "../utils/shell";
import { ICommand } from "./types/ICommand";

export class RevokeCommand extends ICommand {
  public async run(opts: { clientName: string }): Promise<void> {
    const { clientName } = opts;
    try {
      const [err, revokeData] = await executeCommand(
        this.rsaDirectory,
        "./easyrsa",
        ["revoke", clientName, "unspecified"],
        ["yes"]
      );
      if (!revokeData.includes("Revocation was successful.")) {
        throw new Error(err);
      }
      const [errCrl, crlData] = await executeCommand(
        this.rsaDirectory,
        "./easyrsa",
        ["gen-crl"]
      );
      if (!crlData.includes("An updated CRL has been created.")) {
        throw new Error(errCrl);
      }
    } catch (error) {
      logger.error(`[RevokeCommand][run] Error building client ${clientName}`, error);
      throw new Error(`Error building client ${clientName}`);
    }
  }
}
