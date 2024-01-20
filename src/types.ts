export enum MQCertCommand {
  create = "cert.create",
  list = "cert.list",
  show = "cert.show",
  revoke = "cert.revoke",
  delete = "cert.delete",
}

export interface CertCommandPayloadSQS {
  clientName: string;
}

export enum CertCommandStatus {
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
