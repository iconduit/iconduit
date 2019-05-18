const fileUrl = require('file-url')
const {extname, join} = require('path')

const {applyMultiplier} = require('./size.js')
const {generateFileName} = require('./size.js')
const {screenshot} = require('./puppeteer.js')

const {
  IMAGE_TYPE_PNG,
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_TYPE_IMAGE,
  INPUT_TYPE_RENDERABLE,
  INPUT_TYPE_SVG,
  TEMPLATE_COMPOSITE,
} = require('./constant.js')

module.exports = {
  createInputBuilder,
}

function createInputBuilder (services, config, options) {
  return buildInput.bind(null, services, config, options)
}

async function buildInput (services, config, options, request) {
  const {cache: {get, set}} = services
  const {name, size, type} = request

  const cacheKey = buildCacheKey(`input.${name}.${type}`, size)
  const cachePath = get(cacheKey)

  if (cachePath) return cachePath

  const sourcePath = await findSource(services, config, options, request)
  const path = await convertInput(services, options, request, sourcePath)

  set(cacheKey, path)

  return path
}

function buildCacheKey (prefix, size) {
  return size ? generateFileName(`${prefix}.[dimensions]r[pixelRatio]`, size) : prefix
}

async function findSource (services, config, options, request) {
  const {cache: {get, set}} = services
  const {name, size} = request

  const cacheKey = buildCacheKey(`input.${name}.source`, size)
  const cachePath = get(cacheKey)

  if (cachePath) return cachePath

  const filePath = await findFile(services, config, options, request)
  const path = filePath || await deriveSource(services, config, options, request)

  set(cacheKey, path)

  return path
}

async function findFile (services, config, options, request) {
  const {defaultInputDir} = services
  const {userInputDir} = options
  const {name} = request
  const {inputs: {[name]: userGlob}} = config

  if (userGlob) {
    const match = await findFileInDir(services, userInputDir, userGlob, name)

    if (!match) throw new Error(`Unable to find file input for ${name} at ${join(userInputDir, userGlob)}`)

    return match
  }

  const defaultGlob = `${name}.*`
  const userMatch = await findFileInDir(services, userInputDir, defaultGlob, name)

  if (userMatch) return userMatch

  const builtInMatch = await findFileInDir(services, defaultInputDir, defaultGlob, name)

  return builtInMatch || null
}

async function findFileInDir (services, dir, glob, name) {
  const {fileSystem: {globby}} = services
  const matches = await globby(glob, {cwd: dir})

  if (matches.length === 1) return join(dir, matches[0])
  if (matches.length < 1) return null

  throw new Error(`Multiple file inputs found for ${name} at ${join(dir, glob)}`)
}

async function deriveSource (services, config, options, request) {
  const {name, stack} = request
  const {definitions: {input: {[name]: definition}}} = config

  if (!definition) throw new Error(`Missing definition for input.${name}:\n${renderStack(stack)}`)
  assertNonRecursive(request)

  const {strategy} = definition

  switch (strategy) {
    case INPUT_STRATEGY_COMPOSITE: return deriveCompositeSource(services, config, options, request, definition)
    case INPUT_STRATEGY_DEGRADE: return deriveDegradeSource(services, config, options, request, definition)
  }

  throw new Error('Not implemented')
}

function assertNonRecursive (request) {
  const {name, stack} = request

  const seen = [name]

  for (const frame of stack) {
    if (seen.includes(frame)) throw new Error(`Recursive definition found for input.${name}:\n${renderStack(stack)}`)

    seen.push(frame)
  }
}

async function deriveCompositeSource (services, config, options, request, definition) {
  const {name, size, stack, type} = request

  if (type === INPUT_TYPE_SVG) throw new Error(`SVG inputs cannot be composites:\n${renderStack(stack)}`)

  const subStack = [`input.${name}`, ...stack]
  const {fileSystem: {writeFile}, readTemplate} = services
  const {definitions: {style: styleDefinitions}} = config
  const {tempPath} = options
  const {options: {layers, mask}} = definition

  const template = await readTemplate(TEMPLATE_COMPOSITE)

  const layersVariable = await Promise.all(layers.map(async layer => {
    const {input, multiplier, style} = layer

    const styleDefinition = style === null ? {} : styleDefinitions[style]

    if (!styleDefinition) throw new Error(`Missing definition for style.${style}:\n${renderStack(stack)}`)

    const path = await buildInput(services, config, options, {
      name: input,
      type: INPUT_TYPE_IMAGE,
      size: applyMultiplier(size, multiplier),
      stack: subStack,
    })
    const url = fileUrl(path)

    return {...layer, styleDefinition, url}
  }))

  let maskUrl

  if (mask !== null) {
    const path = await buildInput(services, config, options, {
      name: mask,
      type: INPUT_TYPE_SVG,
      size,
      stack: subStack,
    })
    maskUrl = fileUrl(path)
  }

  const rendered = template({
    layers: layersVariable,
    maskUrl,
  })

  const renderedFileName = `${buildCacheKey(`input.${name}.composite`, size)}.html`
  const renderedPath = join(tempPath, renderedFileName)
  await writeFile(renderedPath, rendered)

  return renderedPath
}

async function deriveDegradeSource (services, config, options, request, definition) {
  const {name, size, stack, type} = request
  const {options: {to}} = definition

  return buildInput(services, config, options, {
    name: to,
    type,
    size,
    stack: [`input.${name}`, ...stack],
  })
}

async function convertInput (services, options, request, sourcePath) {
  const {stack, type} = request

  switch (type) {
    case INPUT_TYPE_IMAGE: return convertInputToImage(services, options, request, sourcePath)

    case INPUT_TYPE_RENDERABLE:
    case INPUT_TYPE_SVG:
      return sourcePath
  }

  throw new Error(`Invalid input type ${JSON.stringify(type)} requested:\n${renderStack(stack)}`)
}

async function convertInputToImage (services, options, request, sourcePath) {
  if (isImagePath(sourcePath)) return sourcePath

  const {browser, fileSystem: {writeFile}} = services
  const {tempPath} = options
  const {name, size} = request

  const imagePath = join(tempPath, generateFileName(`input.${name}.image.[dimensions]r[pixelRatio].png`, size))
  const url = fileUrl(sourcePath)

  const image = await screenshot(browser, url, size, {type: IMAGE_TYPE_PNG})
  await writeFile(imagePath, image)

  return imagePath
}

function isImagePath (sourcePath) {
  switch (extname(sourcePath).toLowerCase()) {
    case '.gif':
    case '.jpeg':
    case '.jpg':
    case '.png':
    case '.svg':
      return true
  }

  return false
}

function renderStack (stack) {
  return stack.map(frame => ` at ${frame}`).join('\n')
}
