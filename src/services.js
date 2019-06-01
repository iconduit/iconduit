const Bottle = require('bottlejs')
const {join} = require('path')

const {createBoundTemplateReader, createTemplateReader} = require('./template.js')
const {createBuilder, createConfigBuilder} = require('./build.js')
const {createCacheFactory} = require('./cache.js')
const {createConfigReader} = require('./config-reader.js')
const {createFileSystem} = require('./fs.js')
const {createInputBuilderFactory} = require('./input.js')
const {createInputResolverFactory} = require('./module.js')
const {createLogger} = require('./logging.js')
const {createImageMinifier} = require('./image.js')
const {createScreenshotManager} = require('./screenshot.js')
const {systemClock} = require('./clock.js')

const bottle = new Bottle()

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
bottle.serviceFactory('buildConfigs', createConfigBuilder, 'build', 'fileSystem', 'readConfig', 'screenshotManager')
bottle.constant('clock', systemClock)
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
  'screenshot',
  'templateDir'
)
bottle.serviceFactory('createInputResolver', createInputResolverFactory, 'logger')
bottle.constant('cwd', process.cwd.bind(process))
bottle.constant('defaultInputDir', join(__dirname, '../input'))
bottle.constant('env', process.env)
bottle.serviceFactory('fileSystem', createFileSystem, 'env', 'logger')
bottle.serviceFactory('logger', createLogger, 'env')
bottle.serviceFactory('minifyImage', createImageMinifier)
bottle.serviceFactory('readConfig', createConfigReader, 'cwd', 'fileSystem')
bottle.serviceFactory('readInternalTemplate', createBoundTemplateReader, 'fileSystem', 'cwd', 'templateDir')
bottle.serviceFactory('readTemplate', createTemplateReader, 'fileSystem', 'cwd')
bottle.factory('screenshot', ({screenshotManager}) => screenshotManager.screenshot.bind(screenshotManager))
bottle.serviceFactory('screenshotManager', createScreenshotManager)
bottle.constant('templateDir', join(__dirname, '../template'))

module.exports = bottle.container
