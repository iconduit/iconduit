const createTemplate = require('lodash.template')
const {join} = require('path')

module.exports = {
  createTemplateReader,
}

function createTemplateReader (fileSystem, path) {
  const {readFile} = fileSystem
  const templates = {}

  return async function readTemplate (name) {
    if (!templates[name]) templates[name] = createTemplate(await readFile(join(path, name)))

    return templates[name]
  }
}
