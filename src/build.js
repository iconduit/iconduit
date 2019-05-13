const fileUrl = require('file-url')
const globby = require('globby')
const {dirname, extname, join} = require('path')

const {generateFileNameSizeMap} = require('./size.js')
const {launchBrowser, viewport} = require('./puppeteer.js')
const {resolveSizesForOutputs, selectOutputs} = require('./output.js')

module.exports = {
  build,
}

async function build (services, options) {
  const {basePath, config, outputPath} = options
  const {inputs: inputGlobs} = config

  const outputs = selectOutputs(config)
  const outputSizes = resolveSizesForOutputs(config, outputs)

  const browser = await launchBrowser()

  try {
    services = {...services, browser}

    const threads = []

    for (const name in outputs) {
      threads.push(buildOutput(services, name, outputs[name], outputSizes[name], basePath, inputGlobs, outputPath))
    }

    await Promise.all(threads)
  } finally {
    await browser.close()
  }
}

async function buildOutput (services, name, output, sizes, basePath, inputGlobs, outputPath) {
  const {fs} = services
  const {input: inputName, name: fileNameTemplate} = output

  const inputPath = await findInput(basePath, inputGlobs, inputName)
  const sizesByFilename = generateFileNameSizeMap(fileNameTemplate, sizes)

  for (const filename in sizesByFilename) {
    const fullOutputPath = join(outputPath, filename)

    const content = await buildOutputContent(services, name, inputPath, extname(filename), sizesByFilename[filename])
    await fs.mkdir(dirname(fullOutputPath), {recursive: true})
    await fs.writeFile(fullOutputPath, content)
  }
}

const BUILT_IN_INPUT_DIRECTORY = join(__dirname, '../input')

async function findInput (basePath, inputGlobs, inputName) {
  const userGlob = inputGlobs[inputName]

  if (userGlob) {
    const match = await findInputInDirectory(basePath, userGlob)

    if (!match) throw new Error(`Unable to find input ${inputName} at ${join(basePath, userGlob)}`)

    return match
  }

  const glob = `${inputName}.+(html|svg|png|gif|jpg)`
  const userMatch = await findInputInDirectory(basePath, glob)

  if (userMatch) return userMatch

  const builtInMatch = await findInputInDirectory(BUILT_IN_INPUT_DIRECTORY, glob)

  if (builtInMatch) return builtInMatch

  return null
}

async function findInputInDirectory (directoryPath, glob) {
  const matches = await globby(glob, {cwd: directoryPath})

  if (matches.length < 1) return null

  const byExtension = {}

  for (const match of matches) {
    byExtension[extname(match).toLowerCase()] = match
  }

  const bestMatch =
    byExtension['.html'] ||
    byExtension['.svg'] ||
    byExtension['.png'] ||
    byExtension['.gif'] ||
    byExtension['.jpg']

  return bestMatch ? join(directoryPath, bestMatch) : null
}

async function buildOutputContent (services, name, inputPath, type, sizes) {
  switch (type) {
    case '.png': return buildOutputPng(services, name, inputPath, sizes)
  }
}

const SCREENSHOT_OPTIONS = {
  type: 'png',
  fullPage: false,
  omitBackground: true,
  encoding: 'binary',
}

async function buildOutputPng (services, name, inputPath, sizes) {
  const {browser} = services
  const size = assertFirstSize(sizes, name)
  const sizeViewport = viewport(size)
  const inputUrl = fileUrl(inputPath)

  const page = await browser.newPage()
  let image

  try {
    await page.setViewport(sizeViewport)
    await page.goto(inputUrl)

    image = await page.screenshot(SCREENSHOT_OPTIONS)
  } finally {
    await page.close()
  }

  return image
}

function assertFirstSize (sizes, name) {
  if (sizes.length > 1) throw new Error(`Input ${name} requires size data`)

  return sizes[0]
}
