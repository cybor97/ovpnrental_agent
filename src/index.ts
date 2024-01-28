import pkg from "../package.json";
import logger from "./utils/logger";
import { initSqs } from "./entryPoints/sqs";
import { SecretManagerService } from "./services/SecretManagerService";
import config from "./config";
import { inspect } from "util";

async function main(): Promise<void> {
  logger.info(`[main] Starting ovpnrental_agent(v${pkg.version})`);

  if (config.scaleway.secretId) {
    try {
      const secretManagerService = await SecretManagerService.getService();
      Object.assign(config, secretManagerService.getConfig());
      logger.info(`[main] Loaded config from secret manager`);
    } catch (err) {
      logger.error(
        `[main] Error during SecretManagerService initialization ${inspect(
          err
        )}`
      );
    }
  } else {
    logger.info("[main] No secretId provided, using ENV values");
  }

  await initSqs();
  logger.info("[main] Init complete");
}

main();
