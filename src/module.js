const resolveCps = require('resolve')
const {promisify} = require('util')

const {INPUT_EXTENSIONS} = require('./constant.js')

module.exports = {
  createInputResolverFactory,
}

const resolve = promisify(resolveCps)

function createInputResolverFactory (logger) {
  const resolvers = {}

  return function createInputResolver (path) {
    const existingResolver = resolvers[path]

    if (!existingResolver) {
      const options = {
        basedir: path,
        extensions: INPUT_EXTENSIONS,
      }
      const resolutions = {}
      const results = {}

      resolvers[path] = {
        resolveAsync: resolveAsync.bind(null, logger, resolutions, results, options, path),
        resolveSync: resolveSync.bind(null, logger, results, options, path),
      }
    }

    return resolvers[path]
  }
}

async function resolveAsync (logger, resolutions, results, options, path, id) {
  if (results[id]) return results[id]

  if (!resolutions[id]) {
    resolutions[id] = resolve(id, options)
      .then(
        resolvedPath => {
          logger.debug(`Input module ID ${id} resolved to ${resolvedPath} in ${path}`)

          return resolvedPath
        },
        () => {
          logger.debug(`Input module ID ${id} did not resolve in ${path}`)

          return null
        }
      )
      .then(result => {
        results[id] = result

        return result
      })
  }

  return resolutions[id]
}

async function resolveSync (logger, results, options, path, id) {
  if (!results[id]) {
    try {
      results[id] = resolve.sync(id, options)
      logger.debug(`Input module ID ${id} resolved to ${results[id]} in ${path}`)
    } catch (error) {
      logger.debug(`Input module ID ${id} did not resolve in ${path}`)

      results[id] = null
    }
  }

  return results[id]
}
