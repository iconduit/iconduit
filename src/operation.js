const {DEFAULT_OPERATION_TIMEOUT} = require('./constant.js')

module.exports = {
  createOperationRunner,
}

function createOperationRunner (clock, env, logger) {
  const {withTimeout} = clock
  const {OPERATION_TIMEOUT: envTimeout} = env
  const timeout = envTimeout ? parseInt(envTimeout) : DEFAULT_OPERATION_TIMEOUT

  return async function retryOperation (fn) {
    return withTimeout(timeout, async () => {
      let shouldContinue = true
      let result

      while (shouldContinue) {
        try {
          result = await fn()
          shouldContinue = false
        } catch (error) {
          logger.debug(`Retrying ${fn.name || 'anonymous function'}`)
          shouldContinue = true
        }
      }

      return result
    })
  }
}
