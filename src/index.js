const NodeCache = require('node-cache')
const {join} = require('path')

const {build} = require('./build.js')
const {createFileSystem} = require('./fs.js')
const {createLogger} = require('./logging.js')
const {createTemplateReader} = require('./template.js')
const {normalize} = require('./config.js')

async function main (services) {
  const {fileSystem: {readFile, withTempDir}} = services

  const fixturePath = join(__dirname, '../test/fixture')
  const userInputDir = join(fixturePath, 'input')
  const configPath = join(userInputDir, 'iconduit.json')
  const outputPath = join(fixturePath, 'output')

  const config = normalize(JSON.parse(await readFile(configPath)))

  await withTempDir(async tempPath => {
    const options = {outputPath, tempPath, userInputDir}

    await build(services, options, config)
  })
}

const {env, exit} = process
const logger = createLogger(env)
const cache = new NodeCache()
cache.on('set', (key, value) => { logger.debug(`Setting cache key ${key} to ${JSON.stringify(value)}`) })
const fileSystem = createFileSystem(env, logger)
const services = {
  cache,
  defaultInputDir: join(__dirname, '../input'),
  fileSystem,
  logger,
  readTemplate: createTemplateReader(fileSystem, join(__dirname, '../template')),
}

main(services).catch(({stack}) => {
  logger.error(stack)
  exit(1)
})
