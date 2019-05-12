const {selectOutputs} = require('./output.js')

module.exports = {
  createContext,
}

async function createContext (config) {
  const outputs = selectOutputs(config)

  return {
    outputs,
  }
}
