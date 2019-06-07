const {DEFAULT_OPERATION_DELAY, DEFAULT_OPERATION_TIMEOUT} = require('./constant.js')

module.exports = {
  createOperationRunner,
}

function createOperationRunner (clock, env, logger) {
  const {setTimeout, withTimeout} = clock
  const {OPERATION_DELAY: envDelay, OPERATION_TIMEOUT: envTimeout} = env
  const timeout = envTimeout ? parseInt(envTimeout) : DEFAULT_OPERATION_TIMEOUT
  const delay = envDelay ? parseInt(envDelay) : DEFAULT_OPERATION_DELAY

  return async function retryOperation (fn) {
    return withTimeout(timeout, async () => {
      let shouldContinue = true
      let result

      while (shouldContinue) {
        try {
          result = await fn()
          shouldContinue = false
        } catch (error) {
          logger.warn(`Retrying operation ${fn.name || '(anonymous)'}: ${error.message}`)
          shouldContinue = true
        }

        await new Promise(resolve => setTimeout(resolve, delay))
      }

      return result
    })
  }
}
