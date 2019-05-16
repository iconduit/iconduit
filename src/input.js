const fileUrl = require('file-url')
const {join} = require('path')

const {generateFileName} = require('./size.js')
const {screenshot} = require('./puppeteer.js')

const {
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_TYPE_IMAGE,
  INPUT_TYPE_RENDERABLE,
  INPUT_TYPE_SVG,
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

  return convertInput(services, request, path, cachePath)
}

async function findCache (services, options, request) {
  const {fileSystem: {access}} = services
  const {tempPath} = options
  const {name, size, type} = request

  if (type !== INPUT_TYPE_IMAGE) return [false, null]

  const path =
    join(tempPath, generateFileName(`input-image-${name}-[dimensions]r[pixelRatio]d[pixelDensity].png`, size))

  try {
    await access(path)
  } catch (e) {
    return [false, path]
  }

  return [true, path]
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
  const {stack, type} = request

  if (type === INPUT_TYPE_SVG) throw new Error(`SVG inputs cannot be composites:\n${renderStack(stack)}`)

  console.log(JSON.stringify({definition}))

  throw new Error('Not implemented')
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

async function convertInput (services, request, path, cachePath) {
  const {stack, type} = request

  switch (type) {
    case INPUT_TYPE_IMAGE: return convertInputToImage(services, request, path, cachePath)

    case INPUT_TYPE_RENDERABLE:
    case INPUT_TYPE_SVG:
      return path
  }

  throw new Error(`Invalid input type ${JSON.stringify(type)} requested:\n${renderStack(stack)}`)
}

async function convertInputToImage (services, request, path, cachePath) {
  const {browser, fileSystem: {writeFile}} = services
  const {size} = request
  const url = fileUrl(path)

  const image = await screenshot(browser, url, size)
  await writeFile(cachePath, image)

  return cachePath
}

function renderStack (stack) {
  return stack.map(frame => ` at ${frame}`).join('\n')
}
