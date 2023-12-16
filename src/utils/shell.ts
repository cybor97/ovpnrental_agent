import { ChildProcessWithoutNullStreams, spawn } from "child_process";

export async function executeCommand(
  cwd: string,
  command: string,
  args: string[],
  stdinArgs: string[] = []
): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    const childProcess = runDirectly(cwd, command, args);
    let errData = "";
    let commandData = "";
    for (const arg of stdinArgs) {
      childProcess.stdin.write(arg + "\n");
    }
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
  cwd: string,
  command: string,
  args: string[] = []
): ChildProcessWithoutNullStreams {
  return spawn(command, [...args], { cwd });
}
