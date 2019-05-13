const {generateFileNameSizeMap} = require('./size')

module.exports = {
  buildOutput,
}

async function buildOutput (context, name, output) {
  const {logger, outputSizes} = context
  const {name: fileNameTemplate} = output

  if (!fileNameTemplate) return

  logger.debug(JSON.stringify(generateFileNameSizeMap(fileNameTemplate, outputSizes[name]), null, 2))
}
