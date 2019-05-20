const {join} = require('path')

const {normalize} = require('./config.js')
const services = require('./services.js')

async function main (services) {
  const {build, fileSystem: {readFile, withTempDir}} = services

  const fixturePath = join(__dirname, '../test/fixture')
  const userInputDir = join(fixturePath, 'input')
  const configPath = join(userInputDir, 'iconduit.json')
  const outputPath = join(fixturePath, 'output')

  const config = normalize(JSON.parse(await readFile(configPath)))

  await withTempDir(async tempPath => {
    const options = {configPath, outputPath, tempPath, userInputDir}

    await build(config, options)
  })
}

const {logger, process: {exit}} = services

main(services).catch(({stack}) => {
  logger.error(stack)
  exit(1)
})
