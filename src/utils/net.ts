import { executeCommand } from "./shell";

export async function getMyIp(): Promise<string> {
  const [err, ips] = await executeCommand(process.cwd(), "hostname", ["-I"]);
  if (err) {
    throw new Error(err);
  }
  const [ip] = ips.split(/\s/);
  return ip;
}
