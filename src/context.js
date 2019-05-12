const {selectOutputs} = require('./output.js')

module.exports = {
  createContext,
}

async function createContext (services, config) {
  const {logger} = services
  const outputs = selectOutputs(config)

  return {
    logger,
    outputs,
  }
}
