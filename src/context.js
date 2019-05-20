module.exports = {
  createContextFactory,
}

function createContextFactory (logger) {
  return createContext.bind(null, logger, {})
}

function createContext (logger, usedKeys, name, object) {
  const availableKeys = Object.keys(object)

  return {
    end () {
      for (const key of availableKeys) {
        if (!usedKeys[key]) logger.debug(`Context ${name} had unused key ${key}`)
      }
    },

    get (...keys) {
      const result = []

      for (const key of keys) {
        const value = object[key]

        if (typeof value === 'undefined') throw new Error(`Context ${name} does not contain ${key}`)

        result.push(value)
        usedKeys[key] = true
      }

      return new Proxy(result, createContextGetHandler(name, keys.length))
    },
  }
}

function createContextGetHandler (name, length) {
  return {
    get (object, property) {
      if (property === 'length') return Infinity

      const value = Reflect.get(object, property)

      if (typeof value === 'undefined') {
        throw new Error(
          `Only ${length} values requested from context ${name}, but attempted to access index ${property} from result`
        )
      }

      return value
    },
  }
}
