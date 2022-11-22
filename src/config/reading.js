import { dirname, extname, join } from "path";

export function createConfigReader(cwd, fileSystem, normalizeConfig) {
  const { readFile } = fileSystem;

  return async function readConfig(configPath) {
    switch (extname(configPath)) {
      case "":
        return readDirConfig(configPath);
      case ".js":
        return readJsConfig(configPath);
    }

    return readJsonConfig(configPath);
  };

  async function readDirConfig(configPath) {
    const jsConfigPath = join(configPath, "iconduit.config.js");
    const jsonConfigPath = join(configPath, "iconduit.config.json");

    try {
      return await readJsConfig(jsConfigPath);
    } catch (error) {
      if (!error.isNotFound) throw error;
    }

    try {
      return await readJsonConfig(jsonConfigPath);
    } catch (error) {
      if (!error.isNotFound) throw error;
    }

    throw createNotFound(`${jsConfigPath} or ${jsonConfigPath}`);
  }

  async function readJsConfig(configPath) {
    const absoluteConfigPath = join(cwd(), configPath);
    let configModule;

    try {
      configModule = await import(absoluteConfigPath);
    } catch (error) {
      throw error.code === "MODULE_NOT_FOUND"
        ? createNotFound(configPath)
        : error;
    }

    return buildResult(absoluteConfigPath, configModule.default);
  }

  async function readJsonConfig(configPath) {
    try {
      return buildResult(configPath, JSON.parse(await readFile(configPath)));
    } catch (error) {
      throw error.code === "ENOENT" ? createNotFound(configPath) : error;
    }
  }

  function createNotFound(configPath) {
    const error = new Error(`No config found at ${configPath}`);
    error.isNotFound = true;

    return error;
  }

  function buildResult(configPath, configOrFn) {
    const userInputDir = dirname(configPath);
    const config = typeof configOrFn === "function" ? configOrFn() : configOrFn;

    const normalized = normalizeConfig(config);
    const { outputPath } = normalized;

    return {
      config: normalized,
      configPath,
      outputPath: join(userInputDir, outputPath),
      userInputDir,
    };
  }
}
