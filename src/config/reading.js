const {dirname, extname, join} = require('path')

module.exports = {
  createConfigReader,
}

function createConfigReader (cwd, fileSystem, normalizeConfig) {
  const {readFile} = fileSystem

  return async function readConfig (configPath) {
    switch (extname(configPath)) {
      case '': return readDirConfig(configPath)
      case '.js': return readJsConfig(configPath)
    }

    return readJsonConfig(configPath)
  }

  async function readDirConfig (configPath) {
    let firstError

    try {
      return await readJsConfig(join(configPath, 'iconduit.config.js'))
    } catch (error) {
      firstError = error
    }

    try {
      return await readJsonConfig(join(configPath, 'iconduit.config.json'))
    } catch (error) {
      throw firstError
    }
  }

  async function readJsConfig (configPath) {
    const absoluteConfigPath = join(cwd(), configPath)

    try {
      require.resolve(absoluteConfigPath)
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') throw new Error(`No config found at ${configPath}`)
    }

    return buildResult(absoluteConfigPath, require(absoluteConfigPath))
  }

  async function readJsonConfig (configPath) {
    try {
      return buildResult(configPath, JSON.parse(await readFile(configPath)))
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error(`No config found at ${configPath}`)

      throw error
    }
  }

  function buildResult (configPath, configOrFn) {
    const userInputDir = dirname(configPath)
    const config = typeof configOrFn === 'function' ? configOrFn() : configOrFn

    const normalized = normalizeConfig(config)
    const {outputPath} = normalized

    return {
      config: normalized,
      configPath,
      outputPath: join(userInputDir, outputPath),
      userInputDir,
    }
  }
}
