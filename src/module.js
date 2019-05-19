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

      resolvers[path] = async function resolveInput (id) {
        if (!resolutions[id]) {
          resolutions[id] = resolve(id, options).then(
            resolution => {
              logger.debug(`Input module ID ${id} resolved to ${resolution} in ${path}`)

              return resolution
            },
            () => {
              logger.debug(`Input module ID ${id} did not resolve in ${path}`)

              return null
            }
          )
        }

        return resolutions[id]
      }
    }

    return resolvers[path]
  }
}
