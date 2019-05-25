const {extname, join} = require('path')

module.exports = {
  createConfigReader,
}

function createConfigReader (cwd, fileSystem) {
  const {readFile} = fileSystem

  return async function readConfig (configPath) {
    switch (extname(configPath)) {
      case '.js': return readJsConfig(configPath)
    }

    return readJsonConfig(configPath)
  }

  async function readJsConfig (configPath) {
    const absoluteConfigPath = join(cwd(), configPath)

    try {
      require.resolve(absoluteConfigPath)
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') throw new Error(`No config found at ${configPath}`)
    }

    return require(absoluteConfigPath)
  }

  async function readJsonConfig (configPath) {
    try {
      return JSON.parse(await readFile(configPath))
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error(`No config found at ${configPath}`)

      throw error
    }
  }
}
