const htmlTag = require('html-tag')

const {buildFileName, resolveSize} = require('./size.js')
const {resolveColors} = require('./config.js')
const {resolveReference} = require('./reference.js')

module.exports = {
  buildManifest,
  buildTags,
}

function buildManifest (config, outputs) {
  const meta = {...config}
  delete meta.colors
  delete meta.definitions
  delete meta.inputs
  delete meta.outputs
  delete meta.tags
  delete meta.targets

  return {
    ...meta,

    color: resolveColors(config),
    output: buildManifestOutput(config, outputs),
  }
}

function buildTags (manifest, tags, outputs) {
  const {output: manifestOutput} = manifest
  const tag = {}

  function add (tags, resolveTag, setting) {
    for (const tagName in tags) {
      const setDefinition = tags[tagName]

      for (const sectionName in setDefinition) {
        const tagDefinitions = setDefinition[sectionName]
        const sectionTags = tag[sectionName] || []

        for (let index = 0; index < tagDefinitions.length; ++index) {
          const definition = tagDefinitions[index]

          sectionTags.push(resolveTag(definition, `${setting}.${tagName}.${sectionName}[${index}]`))
        }

        tag[sectionName] = sectionTags
      }
    }
  }

  add(tags, createTagResolver({manifest}), 'definitions.tag')

  for (const outputName in outputs) {
    const {tags} = outputs[outputName]
    const outputSizes = manifestOutput[outputName]

    for (const key in outputSizes) {
      const output = outputSizes[key]

      add(tags, createTagResolver({manifest, output}), `definitions.output.${outputName}.tags`)
    }
  }

  for (const sectionName in tag) {
    tag[sectionName].sort((a, b) => {
      const {sortWeight: weightA, html: htmlA} = a
      const {sortWeight: weightB, html: htmlB} = b

      const weightDelta = weightA - weightB

      if (weightDelta !== 0) return weightDelta

      return htmlA.localeCompare(htmlB)
    })
  }

  return tag
}

function buildManifestOutput (config, outputs) {
  const {definitions: {size: sizeDefinitions}} = config
  const output = {}

  for (const outputName in outputs) {
    const {name: template, sizes} = outputs[outputName]

    if (sizes.length > 0) {
      output[outputName] = {}

      for (const selector of sizes) {
        const {key, ...size} = resolveSize(sizeDefinitions, selector)
        const htmlSizes = buildFileName('[dimensions]', size)
        const path = buildFileName(template, size)

        output[outputName][key] = {htmlSizes, path, size}
      }
    } else {
      output[outputName] = {path: template}
    }
  }

  return output
}

function createTagResolver (definitions) {
  const resolve = resolveReference.bind(null, definitions)

  return function resolveTag (definition) {
    const {
      tag,
      attributes,
      children,
      isSelfClosing,
      sortWeight,
    } = definition

    const resolvedAttributes = {}

    for (const name in attributes) {
      const value = attributes[name]

      if (typeof value === 'string') {
        resolvedAttributes[name] = value
      } else {
        resolvedAttributes[name] = resolve(value)
      }
    }

    const resolvedChildren = children.map(resolveTag)
    const innerHtml = resolvedChildren.map(({html}) => html).join('')
    const html = htmlTag(tag, resolvedAttributes, innerHtml)

    return {
      tag,
      attributes: resolvedAttributes,
      children: resolvedChildren,
      html,
      isSelfClosing,
      sortWeight,
    }
  }
}
