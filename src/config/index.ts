import { config } from "dotenv";

config();

export default {
  tlsVersionMin: process.env.TLS_VERSION_MIN ?? "1.2",
  auth: process.env.AUTH ?? "SHA256",
  rsaDirectory: process.env.RSA_DIRECTORY ?? "/etc/openvpn/easy-rsa/",
  serverId: process.env.SERVER_ID ?? "unknown",
  loki: {
    host: process.env.LOKI_HOST,
    label: process.env.LOKI_LABEL,
    token: process.env.LOKI_TOKEN,
  },
  sqs: {
    region: process.env.SQS_REGION as string,
    accessKeyId: process.env.SQS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY as string,
    endpoint: process.env.SQS_ENDPOINT as string,
    agentQueueUrl: process.env.SQS_AGENT_QUEUE_URL as string,
    appQueueUrl: process.env.SQS_APP_QUEUE_URL as string,
  },
};
