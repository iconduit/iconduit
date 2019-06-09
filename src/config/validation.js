const schema = require('./schema.js')
const {createValidator} = require('../validation.js')

module.exports = {
  createConfigValidator,
}

function createConfigValidator () {
  const validate = createValidator(schema)

  return function validateConfig (config) {
    try {
      return validate(config)
    } catch (error) {
      error.message = `Invalid config:\n${error.message}`

      throw error
    }
  }
}
