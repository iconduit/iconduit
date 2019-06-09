const Bottle = require('bottlejs')
const {join} = require('path')

const {createBoundTemplateReader, createTemplateReader} = require('./template.js')
const {createBrowserManager} = require('./browser.js')
const {createBuilder, createConfigBuilder} = require('./build.js')
const {createCacheFactory} = require('./cache.js')
const {createConfigNormalizer} = require('./config/normalization.js')
const {createConfigReader} = require('./config/reading.js')
const {createConfigValidator} = require('./config/validation.js')
const {createFileSystem} = require('./fs.js')
const {createImageMinifier} = require('./image.js')
const {createInputBuilderFactory} = require('./input.js')
const {createInputResolverFactory} = require('./module.js')
const {createLogger} = require('./logging.js')
const {createOperationRunner} = require('./operation.js')
const {createScreenshotFactory} = require('./screenshot.js')
const {createSvgTransformer} = require('./svg.js')
const {systemClock} = require('./clock.js')

const bottle = new Bottle()

bottle.serviceFactory('browserManager', createBrowserManager, 'env', 'logger', 'retryOperation')
bottle.serviceFactory(
  'build',
  createBuilder,
  'clock',
  'createInputBuilder',
  'cwd',
  'fileSystem',
  'logger',
  'minifyImage',
  'readTemplate',
  'screenshot'
)
bottle.serviceFactory('buildConfigs', createConfigBuilder, 'browserManager', 'build', 'fileSystem', 'readConfig')
bottle.constant('clock', systemClock)
bottle.serviceFactory('validateConfig', createConfigValidator)
bottle.serviceFactory('createCache', createCacheFactory, 'logger')
bottle.serviceFactory(
  'createInputBuilder',
  createInputBuilderFactory,
  'createCache',
  'createInputResolver',
  'defaultInputDir',
  'fileSystem',
  'readInternalTemplate',
  'readTemplate',
  'transformSvg'
)
bottle.serviceFactory('createInputResolver', createInputResolverFactory, 'logger')
bottle.constant('cwd', process.cwd.bind(process))
bottle.constant('defaultInputDir', join(__dirname, '../input'))
bottle.constant('env', process.env)
bottle.serviceFactory('fileSystem', createFileSystem, 'env', 'logger')
bottle.serviceFactory('logger', createLogger, 'env')
bottle.serviceFactory('minifyImage', createImageMinifier)
bottle.serviceFactory('normalizeConfig', createConfigNormalizer, 'validateConfig')
bottle.serviceFactory('readConfig', createConfigReader, 'cwd', 'fileSystem', 'normalizeConfig')
bottle.serviceFactory('readInternalTemplate', createBoundTemplateReader, 'fileSystem', 'cwd', 'templateDir')
bottle.serviceFactory('readTemplate', createTemplateReader, 'fileSystem', 'cwd')
bottle.serviceFactory('retryOperation', createOperationRunner, 'clock', 'env', 'logger')
bottle.serviceFactory('screenshot', createScreenshotFactory, 'withBrowserPage')
bottle.constant('templateDir', join(__dirname, '../template'))
bottle.serviceFactory('transformSvg', createSvgTransformer, 'withBrowserPage')
bottle.factory('withBrowserPage', ({browserManager}) => browserManager.withPage.bind(browserManager))

module.exports = bottle.container
