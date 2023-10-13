#!/usr/bin/env node
/* eslint-disable n/no-unpublished-bin */ /* false positive? */
import services from "../src/services.js";

const { buildConfigs, logger } = services;

async function main() {
  const [, , ...configPaths] = process.argv;
  const { OUTPUT_PATH: outputPath } = process.env;

  if (configPaths.length < 1) return die("Usage: iconduit <config-path>...");
  if (outputPath && configPaths.length > 1)
    return die("Error: OUTPUT_PATH cannot be used with multiple configs");

  await buildConfigs({ outputPath }, ...configPaths);
}

main().catch(({ stack }) => {
  die(stack);
});

function die(message) {
  logger.error(message);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}
