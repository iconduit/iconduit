const systemClock = {
  clearTimeout,
  now,
  setTimeout,
  withTimeout,
}

module.exports = {
  systemClock,
}

function now () {
  return Date.now()
}

function withTimeout (delay, fn) {
  let resolveTimeout

  const timeout = new Promise((resolve, reject) => {
    function rejectTimeout () {
      reject(new Error('Operation timed out'))
    }

    const timeoutId = systemClock.setTimeout(rejectTimeout, delay)

    resolveTimeout = () => {
      systemClock.clearTimeout(timeoutId)
      resolve()
    }
  })

  const operation = fn()
  operation.catch(() => {}).then(resolveTimeout)

  return Promise.race([timeout, operation])
}
