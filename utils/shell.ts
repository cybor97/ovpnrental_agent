import { ChildProcessWithoutNullStreams, spawn } from "child_process";

export async function executeCommand(
  command: string,
  ...args: string[]
): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    const childProcess = runDirectly(command, args);
    let errData = "";
    let commandData = "";
    childProcess.stdout.on("data", (data: Buffer) => {
      commandData += data.toString();
    });
    childProcess.stderr.on("data", (error: Buffer) => {
      errData += error.toString();
    });
    childProcess.on("exit", () => resolve([errData, commandData]));
    childProcess.on("close", () => {
      childProcess.kill("SIGKILL");
      resolve([errData, commandData]);
    });
    childProcess.on("error", (error) => reject(error));
  });
}

function runDirectly(
  command: string,
  args: string[] = []
): ChildProcessWithoutNullStreams {
  return spawn("scw-ovpn", [command, ...args]);
}

