const {join} = require('path')

const {normalize} = require('./config.js')
const services = require('./services.js')

async function main (services) {
  const {build, fileSystem: {withTempDir}, screenshotManager: {run}} = services

  const fixturePath = join(__dirname, '../test/fixture')
  const userInputDir = join(fixturePath, 'input')
  const configPath = join(userInputDir, 'iconduit.config.js')
  const outputPath = join(fixturePath, 'output')

  const config = normalize(require(configPath))

  await withTempDir(async tempPath => {
    const options = {configPath, outputPath, tempPath, userInputDir}

    await run(build.bind(null, config, options))
  })
}

const {exit, logger} = services

main(services).catch(({stack}) => {
  logger.error(stack)
  exit(1)
})
