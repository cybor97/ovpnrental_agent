export default {
  tlsVersionMin: process.env.TLS_VERSION_MIN || "1.2",
  cipher: process.env.CIPHER || "AES256-CBC",
  auth: process.env.AUTH || "SHA256",
  rsaDirectory: process.env.RSA_DIRECTORY || "/etc/openvpn/easy-rsa/",
};
