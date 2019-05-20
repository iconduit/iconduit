const fileUrl = require('file-url')
const toIco = require('to-ico')
const {dirname, extname, join} = require('path')

const {buildFileNameSizeMap} = require('./size.js')
const {IMAGE_TYPE_JPEG, IMAGE_TYPE_PNG, INPUT_TYPE_RENDERABLE, INPUT_TYPE_SVG} = require('./constant.js')
const {resolveSizesForOutputs, selectOutputs} = require('./output.js')
const {toIcns} = require('./icns.js')

module.exports = {
  build,
}

async function build (services, config, options) {
  const {createBrowser, createContext, createInputBuilder, fileSystem, logger} = services

  const outputs = selectOutputs(config)
  const outputSizes = resolveSizesForOutputs(config, outputs)

  const {close, screenshot} = await createBrowser()
  const buildInput = createInputBuilder(config, options)

  try {
    const threads = []

    for (const name in outputs) {
      threads.push(buildOutput(createContext('buildOutput', {
        buildInput,
        createContext,
        fileSystem,
        logger,
        options,
        output: outputs[name],
        outputName: name,
        screenshot,
        sizes: outputSizes[name],
      })))
    }

    await Promise.all(threads)
  } finally {
    await close()
  }
}

async function buildOutput (context) {
  const [
    buildInput,
    createContext,
    fileSystem,
    logger,
    {outputPath},
    {input: inputName, name: fileNameTemplate},
    outputName,
    screenshot,
    sizes,
  ] = context.get(
    'buildInput',
    'createContext',
    'fileSystem',
    'logger',
    'options',
    'output',
    'outputName',
    'screenshot',
    'sizes'
  )
  const {mkdir, writeFile} = fileSystem

  const sizesByFilename = buildFileNameSizeMap(fileNameTemplate, sizes)

  for (const filename in sizesByFilename) {
    const subContext = createContext('buildOutputContent', {
      buildInput,
      fileSystem,
      logger,
      inputName,
      outputName,
      outputSizes: sizesByFilename[filename],
      outputType: extname(filename),
      screenshot,
    })
    const content = await buildOutputContent(subContext)
    subContext.end()

    const fullOutputPath = join(outputPath, filename)
    await mkdir(dirname(fullOutputPath), {recursive: true})
    await writeFile(fullOutputPath, content)
  }

  context.end()
}

async function buildOutputContent (context) {
  const [outputType] = context.get('outputType')

  switch (outputType) {
    case '.icns': return buildOutputIcns(context)
    case '.ico': return buildOutputIco(context)

    case '.jpeg':
    case '.jpg':
      return buildOutputImage(context, IMAGE_TYPE_JPEG)

    case '.png': return buildOutputImage(context, IMAGE_TYPE_PNG)
    case '.svg': return buildOutputSvg(context)
  }

  throw new Error('Not implemented')
}

async function buildOutputIcns (context) {
  const [logger, outputSizes] = context.get('logger', 'outputSizes')

  const entries = await Promise.all(outputSizes.map(
    async size => {
      const content = await buildImage(context, size, IMAGE_TYPE_PNG)

      return {content, size}
    }
  ))

  return toIcns(logger, entries)
}

async function buildOutputIco (context) {
  const [outputSizes] = context.get('outputSizes')

  const pngs = await Promise.all(outputSizes.map(
    async size => buildImage(context, size, IMAGE_TYPE_PNG)
  ))

  return toIco(pngs)
}

async function buildOutputImage (context, imageType) {
  const [outputName, outputSizes] = context.get('outputName', 'outputSizes')
  const size = assertFirstSize(outputSizes, outputName)

  return buildImage(context, size, imageType)
}

async function buildImage (context, size, imageType) {
  const [buildInput, inputName, outputName, screenshot] =
    context.get('buildInput', 'inputName', 'outputName', 'screenshot')
  const stack = [`output.${outputName}`]

  const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_RENDERABLE, size, stack})
  const inputUrl = fileUrl(inputPath)

  return screenshot(inputUrl, size, {type: imageType})
}

async function buildOutputSvg (context) {
  const [buildInput, {readFile}, inputName, outputName, outputSizes] =
    context.get('buildInput', 'fileSystem', 'inputName', 'outputName', 'outputSizes')
  assertNoSizes(outputSizes, outputName)

  const stack = [`output.${outputName}`]
  const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_SVG, stack})

  return readFile(inputPath)
}

function assertFirstSize (outputSizes, outputName) {
  if (outputSizes.length < 1) throw new Error(`Output ${outputName} requires size data`)

  return outputSizes[0]
}

function assertNoSizes (outputSizes, outputName) {
  if (outputSizes.length > 0) throw new Error(`Output ${outputName} cannot accept size data`)
}
