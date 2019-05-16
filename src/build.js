const fileUrl = require('file-url')
const {dirname, extname, join} = require('path')

const {createInputBuilder} = require('./input.js')
const {generateFileNameSizeMap} = require('./size.js')
const {INPUT_TYPE_RENDERABLE, INPUT_TYPE_SVG} = require('./constant.js')
const {launchBrowser, screenshot} = require('./puppeteer.js')
const {resolveSizesForOutputs, selectOutputs} = require('./output.js')

module.exports = {
  build,
}

async function build (services, options, config) {
  const outputs = selectOutputs(config)
  const outputSizes = resolveSizesForOutputs(config, outputs)
  const buildInput = createInputBuilder(services, config, options)

  const browser = await launchBrowser()

  try {
    services = {...services, browser, buildInput}

    const threads = []

    for (const name in outputs) {
      threads.push(buildOutput(services, options, config, name, outputs[name], outputSizes[name]))
    }

    await Promise.all(threads)
  } finally {
    await browser.close()
  }
}

async function buildOutput (services, options, config, outputName, output, sizes) {
  const {fileSystem: {mkdir, writeFile}} = services
  const {outputPath} = options
  const {input: inputName, name: fileNameTemplate} = output

  const sizesByFilename = generateFileNameSizeMap(fileNameTemplate, sizes)

  for (const filename in sizesByFilename) {
    const fullOutputPath = join(outputPath, filename)
    const outputType = extname(filename)
    const outputSizes = sizesByFilename[filename]

    const content = await buildOutputContent(services, inputName, outputName, outputType, outputSizes)
    await mkdir(dirname(fullOutputPath), {recursive: true})
    await writeFile(fullOutputPath, content)
  }
}

async function buildOutputContent (services, inputName, outputName, outputType, outputSizes) {
  switch (outputType) {
    case '.png': return buildOutputImage(services, inputName, outputName, outputSizes, 'png')
    case '.svg': return buildOutputSvg(services, inputName, outputName, outputSizes, 'png')
  }

  throw new Error('Not implemented')
}

async function buildOutputImage (services, inputName, outputName, outputSizes, imageType) {
  const {browser, buildInput} = services
  const size = assertFirstSize(outputSizes, outputName)
  const stack = [`output.${outputName}`]
  const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_RENDERABLE, size, stack})
  const inputUrl = fileUrl(inputPath)

  return screenshot(browser, inputUrl, size, {type: imageType})
}

async function buildOutputSvg (services, inputName, outputName, outputSizes, imageType) {
  const {buildInput, fileSystem: {readFile}} = services
  assertNoSizes(outputSizes, outputName)

  const stack = [`output.${outputName}`]
  const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_SVG, stack})

  return readFile(inputPath)
}

function assertFirstSize (outputSizes, outputName) {
  if (outputSizes.length > 1) throw new Error(`Output ${outputName} requires size data`)

  return outputSizes[0]
}

function assertNoSizes (outputSizes, outputName) {
  if (outputSizes.length > 0) throw new Error(`Output ${outputName} cannot accept size data`)
}
