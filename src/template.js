const createTemplate = require('lodash.template')
const fileUrl = require('file-url')
const {dirname, join, resolve} = require('path')

module.exports = {
  buildInputVariables,
  createBoundTemplateReader,
  createTemplateReader,
}

function buildInputVariables (services, config, options, path) {
  const {createInputResolver} = services
  const {colors: colorTypes, definitions: {color: colorDefinitions}, name} = config

  const {resolveSync} = createInputResolver(dirname(path), path)
  const colors = {}

  for (const colorType in colorTypes) {
    const name = colorTypes[colorType]
    const definition = colorDefinitions[name]

    colors[colorType] = definition || name
  }

  return {
    name,
    colors,

    url (moduleId) {
      const resolvedPath = resolveSync(moduleId)

      return resolvedPath === null ? null : fileUrl(resolvedPath)
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
