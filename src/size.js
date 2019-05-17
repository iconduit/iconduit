const {FILE_NAME_TOKEN_PATTERN, SIZE_SELECTOR_PATTERN} = require('./constant.js')

module.exports = {
  applyMultiplier,
  dipSize,
  generateFileName,
  generateFileNameSizeMap,
  parseSelector,
  resolveSize,
}

function applyMultiplier (definition, multiplier) {
  const {width, height, pixelDensity, pixelRatio} = definition

  return {
    width: width / pixelRatio * multiplier,
    height: height / pixelRatio * multiplier,
    pixelDensity: pixelDensity / pixelRatio * multiplier,
    pixelRatio: multiplier,
  }
}

function dipSize (size) {
  const {width, height, pixelRatio} = size

  return {
    width: width / pixelRatio,
    height: height / pixelRatio,
  }
}

function generateFileName (template, size) {
  const {width, height, pixelDensity, pixelRatio} = size
  const {width: dipWidth, height: dipHeight} = dipSize(size)

  const replacements = {
    atPixelRatioX: pixelRatio === 1 ? '' : `@${pixelRatio}x`,
    dimensions: `${width}x${height}`,
    dipDimensions: `${dipWidth}x${dipHeight}`,
    dipHeight: dipHeight.toString(),
    dipWidth: dipWidth.toString(),
    height: height.toString(),
    pixelDensity: pixelDensity.toString(),
    pixelRatio: pixelRatio.toString(),
    width: width.toString(),
  }

  return template.replace(FILE_NAME_TOKEN_PATTERN, (match, key) => {
    return replacements[key] || ''
  })
}

function generateFileNameSizeMap (template, sizes) {
  if (sizes.length < 1) return {[template]: []}

  const map = {}

  for (const size of sizes) {
    const name = generateFileName(template, size)
    const existing = map[name]

    if (existing) {
      existing.push(size)
    } else {
      map[name] = [size]
    }
  }

  return map
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
