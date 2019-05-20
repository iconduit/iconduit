const NodeCache = require('node-cache')

module.exports = {
  createCacheFactory,
}

function createCacheFactory (logger) {
  return function createCache () {
    const cache = new NodeCache()

    cache.on('set', (key, value) => {
      logger.debug(`Setting cache key ${key} to ${JSON.stringify(value)}`)
    })

    return cache
  }
}
