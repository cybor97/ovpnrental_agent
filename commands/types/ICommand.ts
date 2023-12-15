import { join } from "path";
import config from "../../config";

export abstract class ICommand {
  protected rsaDirectory: string;
  constructor() {
    this.rsaDirectory = config.rsaDirectory;
  }
  public abstract run(opts?: Record<string, string>): Promise<unknown>;

  public getPkiDirectory(): string {
    return join(this.rsaDirectory, "pki");
  }
}
