export interface CommonConfig {
  caCrt: string | null;
  tlsAuth: string | null;
}

export interface ClientConfig {
  key: string | null;
  cert: string | null;
}

export enum CertificateStatus {
  VALID = "V",
  REVOKED = "R",
  EXPIRED = "E",
}

export interface CertificateRecord {
  status: CertificateStatus;
  expirationDate: Date | null;
  revocationDate: Date | null;
  serialNumber: string;
  fileName: string | null;
  commonName: string;
}
