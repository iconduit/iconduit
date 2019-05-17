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
  const [isHit, cachePath] = await findCache(services, options, request)

  if (isHit) return cachePath

  const filePath = await findFile(services, config, options, request)
  const path = filePath || await deriveInput(services, config, options, request)

  return convertInput(services, options, request, path)
}

async function findCache (services, options, request) {
  const {fileSystem: {globby}} = services
  const {tempPath} = options

  const glob = generateCacheFileName(request, '.*')
  const matches = await globby(glob, {cwd: tempPath})

  return matches.length < 1 ? [false, null] : [true, join(tempPath, matches[0])]
}

function generateCacheFileName (request, extension) {
  const {name, size} = request

  return size
    ? generateFileName(`input-${name}-[dimensions]r[pixelRatio]d[pixelDensity]${extension}`, size)
    : `input-${name}${extension}`
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

async function deriveInput (services, config, options, request) {
  const {name, stack} = request
  const {definitions: {input: {[name]: definition}}} = config

  if (!definition) throw new Error(`Missing definition for input.${name}:\n${renderStack(stack)}`)
  assertNonRecursive(request)

  const {strategy} = definition

  switch (strategy) {
    case INPUT_STRATEGY_COMPOSITE: return deriveCompositeInput(services, config, options, request, definition)
    case INPUT_STRATEGY_DEGRADE: return deriveDegradeInput(services, config, options, request, definition)
  }

  throw new Error('Not implemented')
}

async function deriveCompositeInput (services, config, options, request, definition) {
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

  const cachePath = join(tempPath, generateCacheFileName(request, '.html'))
  await writeFile(cachePath, rendered)

  return cachePath
}

async function deriveDegradeInput (services, config, options, request, definition) {
  const {name, size, stack, type} = request
  const {options: {to}} = definition

  return buildInput(services, config, options, {
    name: to,
    type,
    size,
    stack: [`input.${name}`, ...stack],
  })
}

function assertNonRecursive (request) {
  const {name, stack} = request

  const seen = [name]

  for (const frame of stack) {
    if (seen.includes(frame)) throw new Error(`Recursive definition found for input.${name}:\n${renderStack(stack)}`)

    seen.push(frame)
  }
}

async function convertInput (services, options, request, path) {
  const {stack, type} = request

  switch (type) {
    case INPUT_TYPE_IMAGE: return convertInputToImage(services, options, request, path)

    case INPUT_TYPE_RENDERABLE:
    case INPUT_TYPE_SVG:
      return path
  }

  throw new Error(`Invalid input type ${JSON.stringify(type)} requested:\n${renderStack(stack)}`)
}

async function convertInputToImage (services, options, request, path) {
  switch (extname(path).toLowerCase()) {
    case '.gif':
    case '.jpeg':
    case '.jpg':
    case '.png':
    case '.svg':
      return path
  }

  const {browser, fileSystem: {writeFile}} = services
  const {tempPath} = options
  const {size} = request
  const url = fileUrl(path)

  const cachePath = join(tempPath, generateCacheFileName(request, '.png'))
  const image = await screenshot(browser, url, size, {type: IMAGE_TYPE_PNG})
  await writeFile(cachePath, image)

  return cachePath
}

function renderStack (stack) {
  return stack.map(frame => ` at ${frame}`).join('\n')
}
