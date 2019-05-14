const fileUrl = require('file-url')
const {dirname, extname, join} = require('path')

const {createInputBuilder} = require('./input.js')
const {generateFileNameSizeMap} = require('./size.js')
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
  }
}

async function buildOutputImage (services, inputName, outputName, outputSizes, imageType) {
  const {browser, buildInput} = services
  const source = `output.${outputName}`
  const size = assertFirstSize(outputSizes, outputName)
  const inputPath = await buildInput({name: inputName, type: 'renderable', source, size})
  const inputUrl = fileUrl(inputPath)

  return screenshot(browser, inputUrl, size, {type: imageType})
}

function assertFirstSize (outputSizes, outputName) {
  if (outputSizes.length > 1) throw new Error(`Output ${outputName} requires size data`)

  return outputSizes[0]
}
