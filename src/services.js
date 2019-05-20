const Bottle = require('bottlejs')
const {join} = require('path')

const {createBoundTemplateReader, createTemplateReader} = require('./template.js')
const {createBrowserFactory} = require('./browser.js')
const {createCacheFactory} = require('./cache.js')
const {createFileSystem} = require('./fs.js')
const {createInputBuilderFactory} = require('./input.js')
const {createInputResolverFactory} = require('./module.js')
const {createLogger} = require('./logging.js')
const {createOutputBuilder} = require('./output.js')

const bottle = new Bottle()

bottle.serviceFactory('buildOutput', createOutputBuilder, 'createBrowser', 'createInputBuilder', 'fileSystem', 'logger')
bottle.serviceFactory('createBrowser', createBrowserFactory)
bottle.serviceFactory('createCache', createCacheFactory, 'logger')
bottle.serviceFactory(
  'createInputBuilder',
  createInputBuilderFactory,
  'createBrowser',
  'createCache',
  'createInputResolver',
  'defaultInputDir',
  'fileSystem',
  'readInternalTemplate',
  'readTemplate'
)
bottle.serviceFactory('createInputResolver', createInputResolverFactory, 'logger')
bottle.constant('defaultInputDir', join(__dirname, '../input'))
bottle.constant('templateDir', join(__dirname, '../template'))
bottle.constant('cwd', process.cwd.bind(process))
bottle.constant('env', process.env)
bottle.constant('exit', process.exit.bind(process))
bottle.serviceFactory('fileSystem', createFileSystem, 'env', 'logger')
bottle.serviceFactory('logger', createLogger, 'env')
bottle.serviceFactory('readInternalTemplate', createBoundTemplateReader, 'fileSystem', 'cwd', 'templateDir')
bottle.serviceFactory('readTemplate', createTemplateReader, 'fileSystem', 'cwd')

module.exports = bottle.container
