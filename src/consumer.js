const {isAbsolute, relativeUrl, resolveUrl} = require('./url.js')

module.exports = {
  createConsumer,
}

function createConsumer (manifest, baseUrl) {
  const {output, urls: {base: appBaseUrl, output: outputBaseUrl}} = manifest
  const baseRelativeUrl = relativeUrl.bind(null, baseUrl || outputBaseUrl)

  return {
    absoluteUrl (url) {
      const resolved = appBaseUrl ? resolveUrl(appBaseUrl, url) : url

      return isAbsolute(resolved) ? resolved : null
    },

    documentUrl (outputName) {
      const definition = output[outputName]

      return definition ? baseRelativeUrl(definition.url) : null
    },

    forDocument (outputName) {
      const definition = output[outputName]

      if (!definition) throw new Error(`Undefined document output ${JSON.stringify(outputName)}`)

      return createConsumer(manifest, definition.url)
    },

    imageUrl (outputName, sizeKey) {
      const definition = output[outputName] || {}
      const sizeDefinition = definition[sizeKey]

      return sizeDefinition ? baseRelativeUrl(sizeDefinition.url) : null
    },

    url (toUrl) {
      return baseRelativeUrl(toUrl)
    },
  }
}
