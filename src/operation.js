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
    const operation = fn.name || '(anonymous)'

    try {
      return await withTimeout(timeout, async status => {
        let shouldContinue = true
        let result

        while (shouldContinue && !status.isTimeout) {
          try {
            result = await fn()
            shouldContinue = false
          } catch (error) {
            logger.warn(`Retrying operation ${operation}: ${error.message}`)
            shouldContinue = true
          }

          await new Promise(resolve => setTimeout(resolve, delay))
        }

        return result
      })
    } catch (error) {
      if (!error.isTimeout) throw error

      throw new Error(`Operation ${operation} timed out`)
    }
  }
}
