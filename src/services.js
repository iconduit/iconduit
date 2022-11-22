import Bottle from "bottlejs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { createBrowserManager } from "./browser.js";
import { createBuilder, createConfigBuilder } from "./build.js";
import { createCacheFactory } from "./cache.js";
import { systemClock } from "./clock.js";
import { createConfigNormalizer } from "./config/normalization.js";
import { createConfigReader } from "./config/reading.js";
import { createConfigValidator } from "./config/validation.js";
import { createFileSystem } from "./fs.js";
import { createImageMinifier } from "./image.js";
import { createInputBuilderFactory } from "./input.js";
import { createLogger } from "./logging.js";
import { createInputResolverFactory } from "./module.js";
import { createOperationRunner } from "./operation.js";
import { createScreenshotFactory } from "./screenshot.js";
import { createSvgTransformer } from "./svg.js";
import { createBoundTemplateReader, createTemplateReader } from "./template.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const bottle = new Bottle();

bottle.serviceFactory(
  "browserManager",
  createBrowserManager,
  "env",
  "logger",
  "retryOperation"
);
bottle.serviceFactory(
  "build",
  createBuilder,
  "clock",
  "createInputBuilder",
  "cwd",
  "fileSystem",
  "logger",
  "minifyImage",
  "readTemplate",
  "screenshot"
);
bottle.serviceFactory(
  "buildConfigs",
  createConfigBuilder,
  "browserManager",
  "build",
  "fileSystem",
  "readConfig"
);
bottle.constant("clock", systemClock);
bottle.serviceFactory("validateConfig", createConfigValidator);
bottle.serviceFactory("createCache", createCacheFactory, "logger");
bottle.serviceFactory(
  "createInputBuilder",
  createInputBuilderFactory,
  "createCache",
  "createInputResolver",
  "defaultInputDir",
  "fileSystem",
  "readInternalTemplate",
  "readTemplate",
  "transformSvg"
);
bottle.serviceFactory(
  "createInputResolver",
  createInputResolverFactory,
  "logger"
);
bottle.constant("cwd", process.cwd.bind(process));
bottle.constant("defaultInputDir", join(__dirname, "input"));
bottle.constant("env", process.env);
bottle.serviceFactory("fileSystem", createFileSystem, "env", "logger");
bottle.serviceFactory("logger", createLogger, "env");
bottle.serviceFactory("minifyImage", createImageMinifier);
bottle.serviceFactory(
  "normalizeConfig",
  createConfigNormalizer,
  "validateConfig"
);
bottle.serviceFactory(
  "readConfig",
  createConfigReader,
  "cwd",
  "fileSystem",
  "normalizeConfig"
);
bottle.serviceFactory(
  "readInternalTemplate",
  createBoundTemplateReader,
  "fileSystem",
  "cwd",
  "templateDir"
);
bottle.serviceFactory(
  "readTemplate",
  createTemplateReader,
  "fileSystem",
  "cwd"
);
bottle.serviceFactory(
  "retryOperation",
  createOperationRunner,
  "clock",
  "env",
  "logger"
);
bottle.serviceFactory("screenshot", createScreenshotFactory, "withBrowserPage");
bottle.constant("templateDir", join(__dirname, "template"));
bottle.serviceFactory("transformSvg", createSvgTransformer, "withBrowserPage");
bottle.factory("withBrowserPage", ({ browserManager }) =>
  browserManager.withPage.bind(browserManager)
);

export default bottle.container;
