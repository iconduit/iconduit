const {getType} = require('./mime.js')
const {renderSize, resolveSize} = require('./size.js')
const {resolveColors} = require('./config/resolution.js')
const {resolveUrl} = require('./url.js')

module.exports = {
  buildManifest,
}

function buildManifest (config, outputs, tags) {
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
    tag: buildManifestTag(tags, outputs),
  }
}

function buildManifestOutput (config, outputs) {
  const {definitions: {size: sizeDefinitions}, urls: {output: outputBaseUrl}} = config
  const output = {document: {}, image: {}}

  for (const outputName in outputs) {
    const {name: template, sizes} = outputs[outputName]

    if (sizes.length > 0) {
      const imageSizes = {}

      for (const selector of sizes) {
        const {key, ...size} = resolveSize(sizeDefinitions, selector)
        const htmlSizes = renderSize('[dimensions]', size)
        const filename = renderSize(template, size)
        const type = getType(filename)
        const url = resolveUrl(outputBaseUrl, filename)

        imageSizes[key] = {htmlSizes, size, type, url}
      }

      output.image[outputName] = imageSizes
    } else {
      const type = getType(template)
      const url = resolveUrl(outputBaseUrl, template)

      output.document[outputName] = {type, url}
    }
  }

  return output
}

function buildManifestTag (tags, outputs) {
  const tag = {}

  for (const tagName in tags) {
    const setDefinition = tags[tagName]

    for (const sectionName in setDefinition) {
      tag[sectionName] = (tag[sectionName] || []).concat(setDefinition[sectionName])
    }
  }

  for (const outputName in outputs) {
    const {sizes, tags: outputTags} = outputs[outputName]
    const nameKey = sizes.length > 0 ? 'imageName' : 'documentName'

    for (const tagName in outputTags) {
      const setDefinition = outputTags[tagName]

      for (const sectionName in setDefinition) {
        tag[sectionName] = (tag[sectionName] || []).concat(
          setDefinition[sectionName].map(tagDefinition => ({[nameKey]: outputName, ...tagDefinition}))
        )
      }
    }
  }

  for (const sectionName in tag) {
    const sectionTags = tag[sectionName]

    sectionTags.sort((a, b) => {
      const {sortWeight: weightA} = a
      const {sortWeight: weightB} = b

      return weightA - weightB
    })

    tag[sectionName] = sectionTags.map(({sortWeight, ...tagDefinition}) => tagDefinition)
  }

  return tag
}
