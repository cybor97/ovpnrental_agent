import { config } from "dotenv";

config();

export default {
  tlsVersionMin: process.env.TLS_VERSION_MIN ?? "1.2",
  cipher: process.env.CIPHER ?? "AES256-CBC",
  auth: process.env.AUTH ?? "SHA256",
  rsaDirectory: process.env.RSA_DIRECTORY ?? "/etc/openvpn/easy-rsa/",
  natsServer: process.env.NATS_SERVER,
  natsJwt: process.env.NATS_JWT,
  natsNkeySeed: process.env.NATS_NKEY_SEED,
};
