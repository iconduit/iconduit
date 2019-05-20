const Bottle = require('bottlejs')
const NodeCache = require('node-cache')
const {join} = require('path')

const {createBoundTemplateReader, createTemplateReader} = require('./template.js')
const {createBrowserFactory} = require('./browser.js')
const {createBuilder} = require('./build.js')
const {createFileSystem} = require('./fs.js')
const {createInputBuilderFactory} = require('./input.js')
const {createInputResolverFactory} = require('./module.js')
const {createLogger} = require('./logging.js')

const bottle = new Bottle()

bottle.factory('cache', ({logger}) => {
  const cache = new NodeCache()

  cache.on('set', (key, value) => {
    logger.debug(`Setting cache key ${key} to ${JSON.stringify(value)}`)
  })

  return cache
})

bottle.serviceFactory('build', createBuilder, 'createBrowser', 'createInputBuilder', 'fileSystem', 'logger')
bottle.factory('createBrowser', () => createBrowserFactory())
bottle.factory('createInputBuilder', container => createInputBuilderFactory(container))
bottle.factory('createInputResolver', ({logger}) => createInputResolverFactory(logger))
bottle.factory('defaultInputDir', () => join(__dirname, '../input'))
bottle.factory('templateDir', () => join(__dirname, '../template'))
bottle.factory('env', ({process}) => process.env)
bottle.factory('fileSystem', ({env, logger}) => createFileSystem(env, logger))
bottle.factory('logger', ({env}) => createLogger(env))
bottle.constant('process', process)
bottle.factory('readInternalTemplate', ({fileSystem, process, templateDir}) => createBoundTemplateReader(fileSystem, process, templateDir))
bottle.factory('readTemplate', ({fileSystem, process}) => createTemplateReader(fileSystem, process))

module.exports = bottle.container
