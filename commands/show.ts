import * as path from "path";
import config from "../config";
import { ICommand } from "./types/ICommand";
import { ClientConfig, CommonConfig } from "./types";
import { readFile, stat } from "fs/promises";

export class ShowCommand extends ICommand {
  public async run(opts: { ip: string; clientName: string }): Promise<string> {
    const { ip, clientName } = opts;
    const common = await this.getCommonConfig();
    const clientSpecific = await this.getClientSpecificConfig(clientName);

    if (!common.caCrt || !common.tlsAuth) {
      throw new Error("OpenVPN configuration issue #1");
    }

    if (!clientSpecific.key || !clientSpecific.cert) {
      throw new Error(`Certificate not found for client ${clientName}`);
    }

    return [
      "client",
      "nobind",
      "dev tun",
      "redirect-gateway def1",
      this.wrapTag("key", clientSpecific.key),
      this.wrapTag("cert", clientSpecific.cert),
      this.wrapTag("ca", common.caCrt),
      "remote-cert-tls server",
      this.wrapParam("tls-version-min", config.tlsVersionMin),
      this.wrapParam("cipher", config.cipher),
      this.wrapParam("auth", config.auth),
      this.wrapParam("key-direction", "1"),
      this.wrapTag("tls-auth", common.tlsAuth),
      this.wrapParam("remote", ip, "1194", "udp"),
      this.wrapParam("remote", ip, "443", "tcp-client"),
    ].join("\n");
  }

  private async getFileContent(filePath: string): Promise<string> {
    try {
      const exists = await stat(filePath)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        return readFile(filePath, "utf8");
      }
      throw new Error(`File ${filePath} not exists`);
    } catch (error) {
      throw new Error(`Error reading file: ${filePath}`);
    }
  }

  private async getCommonConfig(): Promise<CommonConfig> {
    return {
      caCrt: await this.getFileContent(
        path.join(this.getPkiDirectory(), "ca.crt")
      ),
      tlsAuth: await this.getFileContent(
        path.join(this.getPkiDirectory(), "ta.key")
      ),
    };
  }

  private async getClientSpecificConfig(
    clientName: string
  ): Promise<ClientConfig> {
    return {
      key: await this.getFileContent(
        path.join(this.getPkiDirectory(), "private", `${clientName}.key`)
      ),
      cert: await this.getFileContent(
        path.join(this.getPkiDirectory(), "issued", `${clientName}.crt`)
      ),
    };
  }

  private wrapTag(tagName: string, content: string): string {
    return `<${tagName}>${content}</${tagName}>`;
  }

  private wrapParam(paramName: string, ...paramValues: string[]): string {
    return `${paramName} ${paramValues.join(" ")}`;
  }
}
