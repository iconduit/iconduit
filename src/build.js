const fileUrl = require('file-url')
const toIco = require('to-ico')
const {dirname, extname, join, relative} = require('path')

const {buildFileNameSizeMap, resolveSizesForOutputs} = require('./size.js')
const {buildManifest, buildTags} = require('./manifest.js')
const {outputNames, selectOutputs, targetNames} = require('./target.js')
const {toIcns} = require('./icns.js')

const {
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_PNG,
  INPUT_TYPE_RENDERABLE,
  INPUT_TYPE_SVG,
  INPUT_TYPE_TEMPLATE,
} = require('./constant.js')

module.exports = {
  createBuilder,
}

function createBuilder (clock, createInputBuilder, cwd, fileSystem, logger, readTemplate, screenshot) {
  const {now} = clock
  const {mkdir, readFile, writeFile} = fileSystem

  const listFormatter = new Intl.ListFormat('en', {type: 'conjunction'})

  return async function build (config, options) {
    const startTime = now()
    const {configPath, outputPath} = options

    const {outputs, tags} = selectOutputs(config)
    const sizesByOutput = resolveSizesForOutputs(config, outputs)
    const manifest = await buildManifest(config, outputs)
    const manifestTag = await buildTags(manifest, tags, outputs)

    const buildInput = createInputBuilder(config, options)

    logger.info(`Building ${configPath}`)
    logger.info(`Targets: ${listFormatter.format(targetNames(config))}`)
    logger.info(`Selected outputs: ${listFormatter.format(outputNames(outputs))}`)

    await Promise.all(Object.keys(outputs).map(buildOutput))

    const elapsedTime = now() - startTime
    logger.info(`Built ${configPath} in ${(elapsedTime / 1000).toFixed(2)}s`)

    async function buildOutput (outputName) {
      const {input: inputName, name: fileNameTemplate} = outputs[outputName]
      const sizesByFilename = buildFileNameSizeMap(fileNameTemplate, sizesByOutput[outputName])
      const cwdPath = cwd()

      for (const filename in sizesByFilename) {
        const content = await buildOutputContent(extname(filename), inputName, outputName, sizesByFilename[filename])
        const fullOutputPath = join(outputPath, filename)

        await mkdir(dirname(fullOutputPath), {recursive: true})
        await writeFile(fullOutputPath, content)

        logger.info(`Produced ${relative(cwdPath, fullOutputPath)} from ${inputName}`)
      }
    }

    async function buildOutputContent (outputType, inputName, outputName, outputSizes) {
      switch (outputType) {
        case '.png':
          return buildOutputImage(inputName, outputName, outputSizes, IMAGE_TYPE_PNG)

        case '.jpeg':
        case '.jpg':
          return buildOutputImage(inputName, outputName, outputSizes, IMAGE_TYPE_JPEG)

        case '.icns':
          return buildOutputIcns(inputName, outputName, outputSizes)

        case '.ico':
          return buildOutputIco(inputName, outputName, outputSizes)

        case '.svg':
          return buildOutputSvg(inputName, outputName, outputSizes)

        case '.html':
        case '.js':
        case '.json':
        case '.xml':
          return buildOutputFile(inputName, outputName, outputSizes)
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

    async function buildOutputFile (inputName, outputName, outputSizes) {
      const {options: {variables: templateVariables}} = outputs[outputName]

      assertNoSizes(outputSizes, outputName)

      const stack = [`output.${outputName}`]
      const templatePath = await buildInput({name: inputName, type: INPUT_TYPE_TEMPLATE, stack})
      const template = await readTemplate(templatePath)

      return template({manifest: {...manifest, tag: manifestTag}, ...templateVariables})
    }

    async function buildImage (inputName, outputName, size, imageType) {
      const stack = [`output.${outputName}`]
      const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_RENDERABLE, size, stack})

      return screenshot(fileUrl(inputPath), size, {type: imageType})
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
