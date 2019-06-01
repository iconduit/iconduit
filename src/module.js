const resolveCps = require('resolve')
const {promisify} = require('util')

const {EXTENSIONS_INPUT} = require('./constant.js')

module.exports = {
  createInputResolverFactory,
}

const resolve = promisify(resolveCps)

function createInputResolverFactory (logger) {
  const resolvers = {}

  return function createInputResolver (basePath, path) {
    const existingResolver = resolvers[path]

    if (existingResolver) return existingResolver

    const options = {
      basedir: basePath,
      extensions: EXTENSIONS_INPUT,
    }
    const resolutions = {}
    const results = {}

    resolvers[path] = {
      async resolveAsync (id) {
        if (id === '.') {
          logger.debug(`Module ID . resolved to ${path}`)

          return path
        }

        if (results[id]) return results[id]

        if (!resolutions[id]) {
          resolutions[id] = resolve(id, options)
            .then(
              resolvedPath => {
                logger.debug(`Module ID ${id} resolved to ${resolvedPath} in ${basePath}`)

                return resolvedPath
              },
              () => {
                logger.debug(`Module ID ${id} did not resolve in ${basePath}`)

                return null
              }
            )
            .then(result => {
              results[id] = result

              return result
            })
        }

        return resolutions[id]
      },

      resolveSync (id) {
        if (id === '.') {
          logger.debug(`Module ID . resolved to ${path}`)

          return path
        }

        if (!results[id]) {
          try {
            results[id] = resolve.sync(id, options)
            logger.debug(`Module ID ${id} resolved to ${results[id]} in ${basePath}`)
          } catch (error) {
            logger.debug(`Module ID ${id} did not resolve in ${basePath}`)

            results[id] = null
          }
        }

        return results[id]
      },
    }

    return resolvers[path]
  }
}
