import { readdir } from "fs/promises";
import ListCommand from "./list";
import { CertificateStatus } from "./types";
import path from "path";

const NON_VALID_TERMINAL_STATUSES = [
  CertificateStatus.EXPIRED,
  CertificateStatus.REVOKED,
];

export class NudgeCommand extends ListCommand {
  //@ts-ignore
  public async run(opts: { clientName: string }): Promise<CertificateStatus> {
    const certs = await super.run();
    const cert = certs.find((cert) => cert.commonName === opts.clientName);
    if (cert?.status && NON_VALID_TERMINAL_STATUSES.includes(cert.status)) {
      return cert.status;
    }

    const certFiles = await readdir(
      path.join(this.getPkiDirectory(), "issued")
    );
    const certFile = certFiles.find(
      (certFile) => certFile === `${opts.clientName}.crt`
    );

    const keyFiles = await readdir(
      path.join(this.getPkiDirectory(), "private")
    );
    const keyFile = keyFiles.find(
      (keyFile) => keyFile === `${opts.clientName}.key`
    );

    if (cert && cert.status == CertificateStatus.VALID && certFile && keyFile) {
      return CertificateStatus.VALID;
    }
    if (!cert && !certFile && !keyFile) {
      return CertificateStatus.REVOKED;
    }

    throw new Error(
      `Invalid state: ${JSON.stringify({ cert, certFile, keyFile })}`
    );
  }
}

export default NudgeCommand;
