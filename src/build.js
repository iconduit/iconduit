const fileUrl = require('file-url')
const toIco = require('to-ico')
const {dirname, extname, join, relative} = require('path')

const {buildManifest} = require('./manifest.js')
const {createConsumer} = require('./consumer.js')
const {formatList} = require('./logging.js')
const {groupSizes, resolveSizesForOutputs} = require('./size.js')
const {outputNames, selectOutputs, targetNames} = require('./target.js')
const {toIcns} = require('./icns.js')

const {
  IMAGE_TYPE_ICO_PNG,
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_PNG,
  IMAGE_TYPE_SVG,
  INPUT_TYPE_DOCUMENT,
  INPUT_TYPE_RENDERABLE,
  INPUT_TYPE_SVG,
} = require('./constant.js')

module.exports = {
  createBuilder,
  createConfigBuilder,
}

function createBuilder (clock, createInputBuilder, cwd, fileSystem, logger, minifyImage, readTemplate, screenshot) {
  const {now} = clock
  const {mkdir, readFile, writeFile} = fileSystem

  return async function build (config, options) {
    const startTime = now()
    const {configPath, outputPath} = options

    const {outputs, tags} = selectOutputs(config)

    const sizesByOutput = resolveSizesForOutputs(config, outputs)

    const manifest = await buildManifest(config, outputs, tags)
    const consumer = createConsumer(manifest)

    const buildInput = createInputBuilder(config, options)

    logger.info(`Building ${configPath}`)
    logger.info(`Targets: ${formatList(targetNames(config))}`)
    logger.info(`Selected outputs: ${formatList(outputNames(outputs))}`)

    await Promise.all(Object.keys(outputs).map(buildOutput))

    const elapsedTime = now() - startTime
    logger.info(`Built ${configPath} in ${(elapsedTime / 1000).toFixed(2)}s`)

    async function buildOutput (outputName) {
      const {input: inputName, name: fileNameTemplate} = outputs[outputName]
      const sizesByFilename = groupSizes(fileNameTemplate, sizesByOutput[outputName])
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
      }

      return buildOutputDocument(inputName, outputName, outputSizes)
    }

    async function buildOutputIcns (inputName, outputName, outputSizes) {
      const entries = await Promise.all(outputSizes.map(
        async size => {
          const content =
            await minifyImage(IMAGE_TYPE_PNG, await buildImage(inputName, outputName, size, IMAGE_TYPE_PNG))

          return {content, size}
        }
      ))

      return toIcns(logger, entries)
    }

    async function buildOutputIco (inputName, outputName, outputSizes) {
      const pngs = await Promise.all(outputSizes.map(
        async size => minifyImage(IMAGE_TYPE_ICO_PNG, await buildImage(inputName, outputName, size, IMAGE_TYPE_PNG))
      ))

      return toIco(pngs)
    }

    async function buildOutputImage (inputName, outputName, outputSizes, imageType) {
      const size = assertFirstSize(outputSizes, outputName)

      return minifyImage(imageType, await buildImage(inputName, outputName, size, imageType))
    }

    async function buildOutputSvg (inputName, outputName, outputSizes) {
      assertNoSizes(outputSizes, outputName)

      const stack = [`output.${outputName}`]
      const inputPath = await buildInput({name: inputName, type: INPUT_TYPE_SVG, stack})

      return minifyImage(IMAGE_TYPE_SVG, await readFile(inputPath))
    }

    async function buildOutputDocument (inputName, outputName, outputSizes) {
      const {options: {variables: templateVariables}} = outputs[outputName]

      assertNoSizes(outputSizes, outputName)

      const stack = [`output.${outputName}`]
      const documentPath = await buildInput({name: inputName, type: INPUT_TYPE_DOCUMENT, stack})
      const template = await readTemplate(documentPath)

      return template({consumer: consumer.forDocument(outputName), manifest, ...templateVariables})
    }

    async function buildImage (inputName, outputName, size, imageType) {
      const {masks: {primary: primaryMask, output: outputMasks}} = config
      const {options: {isMasked, isTransparent}} = outputs[outputName]

      const stack = [`output.${outputName}`]
      const inputPath = await buildInput({
        isMasked,
        isTransparent,
        mask: outputMasks[outputName] || primaryMask,
        name: inputName,
        stack,
        type: INPUT_TYPE_RENDERABLE,
      })

      return screenshot(fileUrl(inputPath), size, {type: imageType})
    }
  }
}

function createConfigBuilder (browserManager, build, fileSystem, readConfig) {
  const {withTempDir} = fileSystem
  const {run} = browserManager

  return async function buildConfigs (options, ...inputPaths) {
    const {
      outputPath: customOutputPath,
    } = options

    await run(async () => Promise.all(inputPaths.map(buildConfig)))

    async function buildConfig (inputPath) {
      const {
        config,
        configPath,
        outputPath: configOutputPath,
        userInputDir,
      } = await readConfig(inputPath)

      await withTempDir(async tempPath => {
        await build(config, {
          configPath,
          outputPath: customOutputPath || configOutputPath,
          tempPath,
          userInputDir,
        })
      })
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
