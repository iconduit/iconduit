module.exports = {
  createContextFactory,
}

function createContextFactory (logger) {
  return createContext.bind(null, logger, new Set())
}

function createContext (logger, usedKeys, name, object) {
  const availableKeys = Object.keys(object)

  return {
    concat (name, additional) {
      return createContext(logger, usedKeys, name, {...object, ...additional})
    },

    end () {
      for (const key of availableKeys) {
        if (!usedKeys.has(key)) logger.debug(`Context ${name} had unused key ${key}`)
      }
    },

    get (...keys) {
      const result = []

      for (const key of keys) {
        const value = object[key]

        if (typeof value === 'undefined') throw new Error(`Context does not contain ${key}`)

        result.push(value)
        usedKeys.add(key)
      }

      return result
    },
  }
}
