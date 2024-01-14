import * as fs from "fs/promises";
import { join } from "path";
import { ICommand } from "./types/ICommand";
import { CertificateRecord, CertificateStatus } from "./types";
import { parseEasyRsaDate } from "../utils/date";
import logger from "../utils/logger";

export class ListCommand extends ICommand {
  public async run(): Promise<Array<CertificateRecord>> {
    const filePath = join(this.getPkiDirectory(), "index.txt");
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      return this.parseContent(fileContent);
    } catch (error) {
      logger.error(`[ListCommand][run] Error reading file: ${filePath}`, error);
      return [];
    }
  }

  private parseContent(content: string): Array<CertificateRecord> {
    const lines = content.split("\n");
    const records: CertificateRecord[] = [];

    for (const line of lines) {
      const tokens = line.trim().split("\t");
      if (tokens.length >= 6) {
        const [
          status,
          expirationDate,
          revocationDate,
          serialNumber,
          fileName,
          commonName,
        ] = tokens;
        const record: CertificateRecord = {
          status: status as CertificateStatus,
          expirationDate: parseEasyRsaDate(expirationDate),
          revocationDate: parseEasyRsaDate(revocationDate),
          serialNumber,
          fileName: fileName === "unknown" ? null : fileName,
          commonName: commonName.replace(/^\/CN=/g, ""),
        };
        records.push(record);
      }
    }

    return records;
  }
}

export default ListCommand;
