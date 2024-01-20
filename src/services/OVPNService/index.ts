import { getMyIp } from "../../utils/net";
import { CertificateRecord } from "./commands/types";
import { CERT_COMMANDS } from "./consts";
import { CertCommand, Prefix } from "./types";

export class OVPNService {
  private localIp: string;
  private static instance: OVPNService;
  private constructor(localIp: string) {
    this.localIp = localIp;
  }

  public static async getService(): Promise<OVPNService> {
    if (!OVPNService.instance) {
      const localIp = await getMyIp();
      OVPNService.instance = new OVPNService(localIp);
    }
    return OVPNService.instance;
  }

  public static getAvailableCommands(): Array<CertCommand> {
    return Object.keys(CertCommand) as Array<CertCommand>;
  }

  public runCommand(
    command: string,
    opts: { clientName: string }
  ): Promise<void | string | CertificateRecord[]> {
    const commandPath = command.split(".");
    if (commandPath.length !== 2) {
      throw new Error("Invalid command path");
    }
    const [prefix, commandName] = commandPath as [Prefix, CertCommand];
    switch (prefix) {
      case Prefix.cert:
        return CERT_COMMANDS[commandName].run({
          ...opts,
          ip: this.localIp,
        });
      default:
        throw new Error(`Command ${command} not found`);
    }
  }
}
