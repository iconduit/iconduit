const Ajv = require('ajv')
const escapeString = require('js-string-escape')

module.exports = {
  createValidator,
}

function createValidator (schema) {
  const ajv = new Ajv({allErrors: true, useDefaults: true})
  const validator = ajv.compile(schema)

  return function validate (data) {
    const isValid = validator(data)

    if (isValid) return data

    const {errors} = validator

    const error = new Error(renderErrors(errors))
    error.errors = errors

    throw error
  }
}

function renderErrors (errors) {
  return `  - ${errors.map(renderError).join('\n  - ')}\n`
}

function renderError (error) {
  const {dataPath, keyword, params} = error
  let message

  switch (keyword) {
    case 'additionalProperties': {
      const {additionalProperty} = params
      message = `should NOT have additional property '${escapeString(additionalProperty)}'`

      break
    }

    default: message = error.message
  }

  return `${dataPath} ${message}`
}
