import * as fs from "fs/promises";
import { join } from "path";
import { ICommand } from "./types/ICommand";
import { CertificateRecord } from "./types";

export class ListCommand extends ICommand {
  public async run(): Promise<Array<CertificateRecord>> {
    const filePath = join(this.getPkiDirectory(), "index.txt");
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      return this.parseContent(fileContent);
    } catch (error) {
      console.error(`Error reading file: ${filePath}`, error);
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
          status,
          expirationDate,
          revocationDate,
          serialNumber,
          fileName,
          commonName,
        };
        records.push(record);
      }
    }

    return records;
  }
}

export default ListCommand;
