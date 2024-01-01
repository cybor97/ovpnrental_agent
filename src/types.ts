export interface CertCommandPayloadNATS {
  clientName: string;
}

export enum CertCommandStatus {
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
