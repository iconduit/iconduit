module.exports = {
  buildOutput,
}

async function buildOutput (context, name, output) {
  const {logger, outputSizes} = context

  logger.debug(JSON.stringify(outputSizes[name], null, 2))
}
