import pkg from "../package.json";
import logger from "./utils/logger";
import { initSqs } from "./entryPoints/sqs";

async function main(): Promise<void> {
  logger.info(`[main] Starting ovpnrental_agent(v${pkg.version})`);
  await initSqs();
  logger.info("[main] Init complete");
}

main();
