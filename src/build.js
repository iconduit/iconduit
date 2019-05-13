const {generateFileNameSizeMap} = require('./size.js')
const {resolveSizesForOutputs, selectOutputs} = require('./output.js')

module.exports = {
  build,
}

async function build (services, config) {
  const outputs = selectOutputs(config)
  const outputSizes = resolveSizesForOutputs(config, outputs)

  const threads = []

  for (const name in outputs) {
    threads.push(buildOutput(services, name, outputs[name], outputSizes[name]))
  }

  await Promise.all(threads)
}

async function buildOutput (services, name, output, sizes) {
  const {logger} = services
  const {name: fileNameTemplate} = output

  if (!fileNameTemplate) return

  logger.debug(JSON.stringify(generateFileNameSizeMap(fileNameTemplate, sizes), null, 2))
}
