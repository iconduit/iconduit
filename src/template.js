const createTemplate = require('lodash.template')
const {join, resolve} = require('path')

module.exports = {
  createBoundTemplateReader,
  createTemplateReader,
}

function createBoundTemplateReader (fileSystem, cwd, path) {
  const readTemplate = createTemplateReader(fileSystem, cwd)

  return async function readBoundTemplate (name) {
    return readTemplate(join(path, name))
  }
}

function createTemplateReader (fileSystem, cwd) {
  const {readFile} = fileSystem
  const templates = {}

  return async function readTemplate (path) {
    const fullPath = resolve(cwd(), path)

    if (!templates[fullPath]) templates[fullPath] = createTemplate(await readFile(fullPath))

    return templates[fullPath]
  }
}
