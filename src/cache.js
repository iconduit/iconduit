const NodeCache = require('node-cache')

module.exports = {
  createCacheFactory,
}

function createCacheFactory (logger) {
  return function createCache () {
    const {get, set} = new NodeCache()

    return async function produceCached (key, fn) {
      const cached = get(key)

      if (cached) {
        logger.debug(`Cache hit ${key}`)

        return cached
      }

      logger.debug(`Cache miss ${key}`)

      const promise = (async () => fn())()
      set(key, promise)

      const result = await promise

      logger.debug(`Caching ${key} as ${JSON.stringify(result)}`)

      return promise
    }
  }
}
