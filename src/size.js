const {FILE_NAME_TOKEN_PATTERN, SIZE_SELECTOR_PATTERN} = require('./constant.js')

module.exports = {
  applyMultiplier,
  buildFileName,
  buildFileNameSizeMap,
  dipSize,
  parseSelector,
  resolveSize,
  resolveSizesForOutputs,
}

function applyMultiplier (definition, multiplier) {
  const {key, width, height, deviceWidth, deviceHeight, orientation, pixelDensity, pixelRatio} = definition

  const [keyName] = parseSelector(key)
  const keyAtMultiplierX = multiplier === 1 ? '' : `@${multiplier}x`

  return {
    key: `${keyName}${keyAtMultiplierX}`,
    width: width / pixelRatio * multiplier,
    height: height / pixelRatio * multiplier,
    deviceWidth,
    deviceHeight,
    orientation,
    pixelDensity: pixelDensity / pixelRatio * multiplier,
    pixelRatio: multiplier,
  }
}

function buildFileName (template, size) {
  const {key, width, height, deviceWidth, deviceHeight, orientation, pixelDensity, pixelRatio} = size
  const {width: dipWidth, height: dipHeight} = dipSize(size)

  const replacements = {
    atPixelRatioX: pixelRatio === 1 ? '' : `@${pixelRatio}x`,
    deviceHeight,
    deviceWidth,
    dimensions: `${width}x${height}`,
    dipDimensions: `${dipWidth}x${dipHeight}`,
    dipHeight: dipHeight.toString(),
    dipWidth: dipWidth.toString(),
    height: height.toString(),
    key,
    orientation,
    pixelDensity: pixelDensity.toString(),
    pixelRatio: pixelRatio.toString(),
    width: width.toString(),
  }

  return template.replace(FILE_NAME_TOKEN_PATTERN, (match, key) => {
    return replacements[key] || ''
  })
}

function buildFileNameSizeMap (template, sizes) {
  if (sizes.length < 1) return {[template]: []}

  const map = {}

  for (const size of sizes) {
    const name = buildFileName(template, size)
    const existing = map[name]

    if (existing) {
      existing.push(size)
    } else {
      map[name] = [size]
    }
  }

  return map
}

function dipSize (size) {
  const {width, height, pixelRatio} = size

  return {
    width: width / pixelRatio,
    height: height / pixelRatio,
  }
}

function parseSelector (selector) {
  const match = SIZE_SELECTOR_PATTERN.exec(selector)

  if (!match) throw new Error(`Invalid size selector ${JSON.stringify(selector)}`)

  const [, name, multiplier] = match

  return [name, multiplier ? parseInt(multiplier) : null]
}

function resolveSize (definitions, selector) {
  const [name, multiplier] = parseSelector(selector)
  const definition = definitions[name]

  if (!definition) throw new Error(`Unable to find definition for size.${name}`)

  return multiplier === null ? definition : applyMultiplier(definition, multiplier)
}

function resolveSizesForOutputs (config, outputs) {
  const {definitions: {size: definitions}} = config
  const sizes = {}

  for (const name in outputs) {
    const {sizes: outputSizes} = outputs[name]

    sizes[name] = outputSizes.map(resolveSize.bind(null, definitions))
  }

  return sizes
}
