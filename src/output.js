const fileUrl = require('file-url')
const toIco = require('to-ico')
const {dirname, extname, join} = require('path')

const {buildFileNameSizeMap, resolveSizesForOutputs} = require('./size.js')
const {IMAGE_TYPE_JPEG, IMAGE_TYPE_PNG, INPUT_TYPE_RENDERABLE, INPUT_TYPE_SVG} = require('./constant.js')
const {selectOutputs} = require('./target.js')
const {toIcns} = require('./icns.js')

module.exports = {
  createOutputBuilder,
}

function createOutputBuilder (createBrowser, createInputBuilder, fileSystem, logger) {
  const {mkdir, readFile, writeFile} = fileSystem

  return async function buildOutput (config, options) {
    const {outputPath} = options

    const outputs = selectOutputs(config)
    const sizesByOutput = resolveSizesForOutputs(config, outputs)

    const {close, screenshot} = await createBrowser()
    const buildInput = createInputBuilder(config, options)

    async function buildOutput (outputName) {
      const {input: inputName, name: fileNameTemplate} = outputs[outputName]
      const sizesByFilename = buildFileNameSizeMap(fileNameTemplate, sizesByOutput[outputName])

      for (const filename in sizesByFilename) {
        const content = await buildOutputContent(extname(filename), inputName, outputName, sizesByFilename[filename])
        const fullOutputPath = join(outputPath, filename)

        await mkdir(dirname(fullOutputPath), {recursive: true})
        await writeFile(fullOutputPath, content)
      }
    }

    async function buildOutputContent (outputType, inputName, outputName, outputSizes) {
      switch (outputType) {
        case '.icns': return buildOutputIcns(inputName, outputName, outputSizes)
        case '.ico': return buildOutputIco(inputName, outputName, outputSizes)

        case '.jpeg':
        case '.jpg':
          return buildOutputImage(inputName, outputName, outputSizes, IMAGE_TYPE_JPEG)

        case '.png': return buildOutputImage(inputName, outputName, outputSizes, IMAGE_TYPE_PNG)
        case '.svg': return buildOutputSvg(inputName, outputName, outputSizes)
      }

      throw new Error('Not implemented')
    }

    async function buildOutputIcns (inputName, outputName, outputSizes) {
      const entries = await Promise.all(outputSizes.map(
        async size => {
          const content = await buildImage(inputName, outputName, size, IMAGE_TYPE_PNG)

          return {content, size}
        }
      ))

      return toIcns(logger, entries)
    }

    async function buildOutputIco (inputName, outputName, outputSizes) {
      const pngs = await Promise.all(outputSizes.map(
        async size => buildImage(inputName, outputName, size, IMAGE_TYPE_PNG)
      ))

      return toIco(pngs)
    }

    async function buildOutputImage (inputName, outputName, outputSizes, imageType) {
      const size = assertFirstSize(outputSizes, outputName)

      return buildImage(inputName, outputName, size, imageType)
    }

    async function buildOutputSvg (inputName, outputName, outputSizes) {
      assertNoSizes(outputSizes, outputName)

      const stack = [`output.${outputName}`]
      const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_SVG, stack})

      return readFile(inputPath)
    }

    async function buildImage (inputName, outputName, size, imageType) {
      const stack = [`output.${outputName}`]
      const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_RENDERABLE, size, stack})

      return screenshot(fileUrl(inputPath), size, {type: imageType})
    }

    try {
      await Promise.all(Object.keys(outputs).map(buildOutput))
    } finally {
      await close()
    }
  }
}

function assertFirstSize (outputSizes, outputName) {
  if (outputSizes.length < 1) throw new Error(`Output ${outputName} requires size data`)

  return outputSizes[0]
}

function assertNoSizes (outputSizes, outputName) {
  if (outputSizes.length > 0) throw new Error(`Output ${outputName} cannot accept size data`)
}
