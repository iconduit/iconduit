const fs = require('fs')
const {join} = require('path')

const {build} = require('./build.js')
const {createLogger} = require('./logging.js')
const {normalize} = require('./config.js')
const {promisifyFileSystem} = require('./fs.js')

async function main (services) {
  const {fs} = services

  const fixturePath = join(__dirname, '../test/fixture')
  const basePath = join(fixturePath, 'input')
  const configPath = join(basePath, 'iconduit.json')
  const outputPath = join(fixturePath, 'output')

  const config = normalize(JSON.parse(await fs.readFile(configPath)))
  const options = {basePath, config, outputPath}

  await build(services, options)
}

const {env, exit} = process
const logger = createLogger(env)
const services = {
  fs: promisifyFileSystem(fs),
  logger,
}

main(services).catch(({stack}) => {
  logger.error(stack)
  exit(1)
})
