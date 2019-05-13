const {resolveSize} = require('./size.js')
const {selectOutputs} = require('./output.js')

module.exports = {
  createContext,
}

async function createContext (services, config) {
  const {logger} = services
  const outputs = selectOutputs(config)
  const outputSizes = resolveSizesForOutputs(config, outputs)

  return {
    config,
    logger,
    outputs,
    outputSizes,
  }
}

function resolveSizesForOutputs (config, outputs) {
  const {definitions: {size: definitions}} = config
  const sizes = {}

  for (const name in outputs) {
    sizes[name] = resolveSizesForOutput(definitions, name, outputs[name])
  }

  return sizes
}

function resolveSizesForOutput (definitions, name, output) {
  const {sizes = []} = output

  return sizes.map(resolveSize.bind(null, definitions))
}
