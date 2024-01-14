import { executeCommand } from "./shell";

export async function getMyIp(): Promise<string> {
  let command: [string, string[]];
  const [osErr, os] = await executeCommand(process.cwd(), "uname", []);
  if (osErr) {
    throw new Error(osErr);
  }
  if (os.includes("Darwin")) {
    command = ["curl", ["ifconfig.me/ip", "-s"]];
  } else {
    command = ["hostname", ["-I"]];
  }
  const [err, ips] = await executeCommand(process.cwd(), ...command);
  if (err) {
    throw new Error(err);
  }
  const [ip] = ips.split(/\s/);
  return ip.replace(/\%/g, "");
}
