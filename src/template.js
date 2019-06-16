const htmlTag = require('html-tag')
const stringify = require('json-stable-stringify-without-jsonify')
const {compile, render} = require('ejs')
const {cssifyObject: css} = require('css-in-js-utils')
const {join, resolve} = require('path')

module.exports = {
  createBoundTemplateReader,
  createTagRenderer,
  createTemplateReader,
}

function createBoundTemplateReader (fileSystem, cwd, basePath) {
  const readTemplate = createTemplateReader(fileSystem, cwd)

  return async function readBoundTemplate (name) {
    return readTemplate(join(basePath, name))
  }
}

function createTagRenderer (data) {
  function renderValue (value) {
    return render(value, data, {escape: identity})
  }

  return function renderTag (definition) {
    const {attributes, children, predicate, tag} = definition

    for (const value of predicate) {
      if (!renderValue(value)) return null
    }

    const renderedAttributes = {}

    for (const name in attributes) {
      renderedAttributes[name] = renderValue(attributes[name])
    }

    const renderedChildren = children.map(renderTag)
    const innerHtml = renderedChildren.join('')

    return htmlTag(tag, renderedAttributes, innerHtml)
  }
}

function createTemplateReader (fileSystem, cwd) {
  const {readFile} = fileSystem
  const templates = {}

  return async function readTemplate (templatePath) {
    const fullPath = resolve(cwd(), templatePath)

    if (!templates[fullPath]) {
      const content = await readFile(fullPath)
      const template = compile(content.toString(), {filename: fullPath})

      templates[fullPath] = variables => template({css, json, ...variables})
    }

    return templates[fullPath]
  }
}

function identity (value) {
  return value
}

function json (value, space = 2) {
  return stringify(value, {space})
}
