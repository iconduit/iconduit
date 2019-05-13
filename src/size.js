module.exports = {
  generateFileNameSizeMap,
  resolveSize,
}

const FILE_NAME_TOKEN_PATTERN = /\[([^\]]+)]/g

function generateFileNameSizeMap (template, sizes) {
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

function resolveSize (definitions, selector) {
  const [name, multiplier] = parseSelector(selector)
  const definition = definitions[name]

  if (!definition) throw new Error(`Unable to find definition for size.${name}`)

  return multiplier === null ? definition : applyMultiplier(definition, multiplier)
}

function generateFileName (template, size) {
  const {width, height, pixelDensity, pixelRatio} = size
  const replacements = {
    atPixelRatioX: pixelRatio === 1 ? '' : `@${pixelRatio}x`,
    dimensions: `${width}x${height}`,
    height: height.toString(),
    pixelDensity: pixelDensity.toString(),
    pixelRatio: pixelRatio.toString(),
    width: width.toString(),
  }

  return template.replace(FILE_NAME_TOKEN_PATTERN, (match, key) => {
    return replacements[key] || ''
  })
}

const SELECTOR_PATTERN = /^([^@]*)(?:@(\d+)x)?$/

function parseSelector (selector) {
  const match = SELECTOR_PATTERN.exec(selector)

  if (!match) throw new Error(`Invalid size selector ${JSON.stringify(selector)}`)

  const [, name, multiplier] = match

  return [name, multiplier ? parseInt(multiplier) : null]
}

function applyMultiplier (definition, multiplier) {
  const {width, height, pixelDensity, pixelRatio} = definition

  return {
    width: width / pixelRatio * multiplier,
    height: height / pixelRatio * multiplier,
    pixelDensity: pixelDensity / pixelDensity * multiplier,
    pixelRatio: multiplier,
  }
}
