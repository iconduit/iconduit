const fileUrl = require('file-url')
const {join} = require('path')

const {generateFileName} = require('./size.js')
const {screenshot} = require('./puppeteer.js')

module.exports = {
  createInputBuilder,
}

const INPUT_TYPE_IMAGE = 'image'
const INPUT_TYPE_RENDERABLE = 'renderable'

function createInputBuilder (services, config, options) {
  return async function buildInput (request) {
    const [isHit, cachePath] = await findCache(services, options, request)

    if (isHit) return cachePath

    const filePath = await findFile(services, config, options, request)
    const path = filePath // || compose an input?

    return convertInput(services, request, path, cachePath)
  }
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

async function convertInput (services, request, path, cachePath) {
  const {source, type} = request

  switch (type) {
    case INPUT_TYPE_IMAGE: return convertInputToImage(services, request, path, cachePath)
    case INPUT_TYPE_RENDERABLE: return path
  }

  throw new Error(`Invalid input type ${JSON.stringify(type)} requested by ${source}`)
}

async function convertInputToImage (services, request, path, cachePath) {
  const {browser, fileSystem: {writeFile}} = services
  const {size} = request
  const url = fileUrl(path)

  const image = await screenshot(browser, url, size)
  await writeFile(cachePath, image)

  return cachePath
}
