import stringify from 'json-stable-stringify-without-jsonify'
import {compile} from 'ejs'
import {cssifyObject as css} from 'css-in-js-utils'
import {join, resolve} from 'path'

export function createBoundTemplateReader (fileSystem, cwd, basePath) {
  const readTemplate = createTemplateReader(fileSystem, cwd)

  return async function readBoundTemplate (name) {
    return readTemplate(join(basePath, name))
  }
}

export function createTemplateReader (fileSystem, cwd) {
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

function json (value, space = 2) {
  return stringify(value, {space})
}
