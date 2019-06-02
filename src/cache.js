module.exports = {
  createCacheFactory,
}

function createCacheFactory (logger) {
  return function createCache () {
    const map = {}

    return async function produceCached (key, fn) {
      const cached = map[key]

      if (cached) {
        logger.debug(`Cache hit ${key}`)

        return cached
      }

      logger.debug(`Cache miss ${key}`)

      const promise = Promise.resolve(fn())
      map[key] = promise

      const result = await promise

      logger.debug(`Caching ${key} as ${JSON.stringify(result)}`)

      return promise
    }
  }
}
