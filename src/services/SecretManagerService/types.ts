export interface SecretManagerConfig {
  accessKey: string;
  secretKey: string;
  projectId: string;
  secretId: string;
  region: string;
}

export interface AppConfig {
  tlsVersionMin: string;
  auth: string;
  rsaDirectory: string;
  serverId: string;
  loki: {
    host: string;
    label: string;
    token: string;
  };
  sqs: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    agentQueueUrl: string;
    appQueueUrl: string;
  };
  scaleway: {
    accessKey: string;
    secretKey: string;
    projectId: string;
    secretId: string;
    region: string;
  };
}
export interface SecretManagerResponse {
  secret_id: string;
  revision: number;
  data: string;
  data_crc32: number;
}
