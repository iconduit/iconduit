const createTemplate = require('lodash.template')
const fileUrl = require('file-url')
const {join, resolve, sep} = require('path')

module.exports = {
  buildInputVariables,
  createBoundTemplateReader,
  createTemplateReader,
}

function buildInputVariables (services, config, options, path) {
  const {defaultInputDir} = services
  const {colors: colorTypes, definitions: {color: colorDefinitions}, name} = config
  const {userInputDir} = options

  const colors = {}

  for (const colorType in colorTypes) {
    const name = colorTypes[colorType]
    const definition = colorDefinitions[name]

    colors[colorType] = definition || name
  }

  return {
    name,
    colors,
    urls: {
      defaultInput: fileUrl(defaultInputDir) + sep,
      self: fileUrl(path),
      userInput: fileUrl(userInputDir) + sep,
    },
  }
}

function createBoundTemplateReader (fileSystem, process, path) {
  const readTemplate = createTemplateReader(fileSystem, process)

  return async function readBoundTemplate (name) {
    return readTemplate(join(path, name))
  }
}

function createTemplateReader (fileSystem, process) {
  const {readFile} = fileSystem
  const templates = {}

  return async function readTemplate (path) {
    const fullPath = resolve(process.cwd(), path)

    if (!templates[fullPath]) templates[fullPath] = createTemplate(await readFile(fullPath))

    return templates[fullPath]
  }
}
