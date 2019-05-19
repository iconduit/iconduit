const resolveCps = require('resolve')
const {promisify} = require('util')

const {INPUT_EXTENSIONS} = require('./constant.js')

module.exports = {
  createInputResolverFactory,
}

const resolve = promisify(resolveCps)

function createInputResolverFactory (logger) {
  const resolvers = {}

  return function createInputResolver (basePath, path) {
    const existingResolver = resolvers[path]

    if (!existingResolver) {
      const options = {
        basedir: basePath,
        extensions: INPUT_EXTENSIONS,
      }
      const resolutions = {}
      const results = {}

      resolvers[path] = {
        resolveAsync: resolveAsync.bind(null, logger, resolutions, results, options, basePath, path),
        resolveSync: resolveSync.bind(null, logger, results, options, basePath, path),
      }
    }

    return resolvers[path]
  }
}

async function resolveAsync (logger, resolutions, results, options, basePath, path, id) {
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
}

function resolveSync (logger, results, options, basePath, path, id) {
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
}
