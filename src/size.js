module.exports = {
  resolveSize,
}

function resolveSize (definitions, selector) {
  const [name, pixelRatio] = parseSelector(selector)
  const definition = definitions[name]

  if (!definition) throw new Error(`Unable to find definition for size.${name}`)

  return applyPixelRatio(definition, pixelRatio)
}

const SELECTOR_PATTERN = /^([^@]*)(?:@(\d+)x)?$/

function parseSelector (selector) {
  const match = SELECTOR_PATTERN.exec(selector)

  if (!match) throw new Error(`Invalid size selector ${JSON.stringify(selector)}`)

  const [, name, pixelRatio] = match

  return [name, pixelRatio ? parseInt(pixelRatio) : 1]
}

function applyPixelRatio (definition, pixelRatio) {
  const {width, height} = definition

  return {
    width: width * pixelRatio,
    height: height * pixelRatio,
    pixelRatio,
  }
}
