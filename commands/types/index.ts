export interface CommonConfig {
  caCrt: string | null;
  tlsAuth: string | null;
}

export interface ClientConfig {
  key: string | null;
  cert: string | null;
}

export interface CertificateRecord {
  status: string;
  expirationDate: string;
  revocationDate: string | null;
  serialNumber: string;
  fileName: string;
  commonName: string;
}
