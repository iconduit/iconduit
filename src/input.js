const fileUrl = require('file-url')
const {extname, join} = require('path')

const {applyMultiplier} = require('./size.js')
const {buildFileName} = require('./size.js')
const {buildInputVariables} = require('./template.js')
const {screenshot} = require('./puppeteer.js')

const {
  IMAGE_EXTENSIONS,
  IMAGE_TYPE_PNG,
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_TYPE_IMAGE,
  INPUT_TYPE_RENDERABLE,
  INPUT_TYPE_SVG,
  TEMPLATE_COMPOSITE,
  TEMPLATE_EXTENSIONS,
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

async function findSource (services, config, options, request) {
  const {cache: {get, set}} = services
  const {name, size} = request

  const cacheKey = buildCacheKey(`input.${name}.source`, size)
  const cachePath = get(cacheKey)

  if (cachePath) return cachePath

  let path
  const filePath = await findFile(services, config, options, request)

  if (filePath) {
    if (isTemplatePath(filePath)) {
      path = await buildTemplateInput(services, config, options, request, filePath)
    } else {
      path = filePath
    }
  } else {
    path = await deriveSource(services, config, options, request)
  }

  set(cacheKey, path)

  return path
}

async function findFile (services, config, options, request) {
  const {createInputResolver, defaultInputDir} = services
  const {configPath, userInputDir} = options
  const {name} = request
  const {inputs: {[name]: userModuleId}} = config

  const {resolveAsync: resolveUserInput} = createInputResolver(userInputDir, configPath)

  if (userModuleId) {
    const resolvedPath = await resolveUserInput(userModuleId)

    if (!resolvedPath) throw new Error(`Unable to resolve input for ${name} at ${userModuleId} from ${userInputDir}`)

    return resolvedPath
  }

  const defaultModuleId = `./${name}`
  const userPath = await resolveUserInput(defaultModuleId)

  if (userPath) return userPath

  const {resolveAsync: resolveDefaultInput} = createInputResolver(defaultInputDir, defaultInputDir)
  const defaultPath = await resolveDefaultInput(defaultModuleId)

  return defaultPath || null
}

async function buildTemplateInput (services, config, options, request, filePath) {
  const {fileSystem: {writeFile}, readTemplate} = services
  const {tempPath} = options
  const {name} = request

  const renderedPath = buildCachePath(tempPath, `input.${name}.rendered`, extname(filePath))
  const template = await readTemplate(filePath)
  const rendered = template(buildInputVariables(services, config, options, filePath))

  await writeFile(renderedPath, rendered)

  return renderedPath
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
  const {fileSystem: {writeFile}, readInternalTemplate} = services
  const {definitions: {style: styleDefinitions}} = config
  const {tempPath} = options
  const {options: {backgroundColor, layers, mask}} = definition

  const template = await readInternalTemplate(TEMPLATE_COMPOSITE)

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
    backgroundColor,
    layers: layersVariable,
    maskUrl,
  })

  const renderedPath = buildCachePath(tempPath, `input.${name}.composite`, '.html', size)
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

  const imagePath = buildCachePath(tempPath, `input.${name}.image`, '.png', size)
  const url = fileUrl(sourcePath)

  const image = await screenshot(browser, url, size, {type: IMAGE_TYPE_PNG})
  await writeFile(imagePath, image)

  return imagePath
}

function isImagePath (sourcePath) {
  return IMAGE_EXTENSIONS.includes(extname(sourcePath).toLowerCase())
}

function isTemplatePath (sourcePath) {
  return TEMPLATE_EXTENSIONS.includes(extname(sourcePath).toLowerCase())
}

function buildCacheKey (prefix, size) {
  return size ? buildFileName(`${prefix}.[dimensions]r[pixelRatio]`, size) : prefix
}

function buildCachePath (tempPath, prefix, extension, size) {
  return join(tempPath, `${buildCacheKey(prefix, size)}${extension}`)
}

function renderStack (stack) {
  return stack.map(frame => ` at ${frame}`).join('\n')
}
