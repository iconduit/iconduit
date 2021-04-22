import schema from './schema.js'
import {createValidator} from '../validation.js'

export function createConfigValidator () {
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
