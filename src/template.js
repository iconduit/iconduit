const stringify = require('json-stable-stringify')
const {compile} = require('ejs')
const {cssifyObject: css} = require('css-in-js-utils')
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

    if (!templates[fullPath]) {
      const content = await readFile(fullPath)
      const template = compile(content.toString(), {filename: fullPath})

      templates[fullPath] = variables => template({css, json, ...variables})
    }

    return templates[fullPath]
  }
}

function json (value, space = 2) {
  return stringify(value, {space})
}
