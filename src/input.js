const fileUrl = require('file-url')
const {dirname, extname, join} = require('path')

const {applyMultiplier} = require('./size.js')
const {buildFileName} = require('./size.js')
const {resolveColors} = require('./config.js')

const {
  IMAGE_EXTENSIONS,
  IMAGE_TYPE_PNG,
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_TYPE_IMAGE,
  INPUT_TYPE_SVG,
  INPUT_TYPE_TEMPLATE,
  TEMPLATE_COMPOSITE,
  TEMPLATE_EXTENSIONS,
} = require('./constant.js')

module.exports = {
  createInputBuilderFactory,
}

function createInputBuilderFactory (
  createCache,
  createInputResolver,
  defaultInputDir,
  fileSystem,
  readInternalTemplate,
  readTemplate,
  screenshot
) {
  const {writeFile} = fileSystem

  const {resolveAsync: resolveDefaultInput} = createInputResolver(defaultInputDir, defaultInputDir)

  return function createInputBuilder (config, options) {
    const {definitions: {style: styleDefinitions}, name: appName} = config
    const {configPath, tempPath, userInputDir} = options

    const {get, set} = createCache()
    const color = resolveColors(config)

    return async function buildInput (request) {
      assertNonRecursive(request)

      const {name: inputName, size: inputSize, stack, type: inputType} = request
      const subStack = [`input.${inputName}`, ...stack]

      const {
        definitions: {
          input: {[inputName]: inputDefinition},
        },
        inputs: {[inputName]: userModuleId},
      } = config

      const {resolveAsync: resolveUserInput} = createInputResolver(userInputDir, configPath)

      const cacheKey = buildCacheKey(`input.${inputName}.${inputType}`, inputSize)
      const cachePath = get(cacheKey)

      if (cachePath) return cachePath

      const sourcePath = await findSource()
      const finalPath = inputType === INPUT_TYPE_IMAGE ? await convertInputToImage(sourcePath) : sourcePath

      set(cacheKey, finalPath)

      return finalPath

      async function findSource () {
        const sourceCacheKey = buildCacheKey(`input.${inputName}.source`, inputSize)
        const sourceCachePath = get(sourceCacheKey)

        if (sourceCachePath) return sourceCachePath

        let sourcePath
        const filePath = await findFile()

        if (filePath) {
          if (isTemplatePath(filePath) && inputType !== INPUT_TYPE_TEMPLATE) {
            sourcePath = await buildTemplateInput(filePath)
          } else {
            sourcePath = filePath
          }
        } else {
          sourcePath = await deriveSource()
        }

        set(sourceCacheKey, sourcePath)

        return sourcePath
      }

      async function findFile () {
        if (userModuleId) {
          const resolvedPath = await resolveUserInput(userModuleId)

          if (!resolvedPath) {
            throw new Error(`Unable to resolve input for ${inputName} at ${userModuleId} from ${userInputDir}`)
          }

          return resolvedPath
        }

        const defaultModuleId = `./${inputName}`

        return (
          await resolveUserInput(defaultModuleId) ||
          await resolveDefaultInput(defaultModuleId) ||
          null
        )
      }

      async function buildTemplateInput (templatePath) {
        const renderedPath = buildCachePath(tempPath, `input.${inputName}.rendered`, extname(templatePath))
        const {resolveSync: resolveTemplateInput} = createInputResolver(dirname(templatePath), templatePath)

        function url (moduleId) {
          const resolvedPath = resolveTemplateInput(moduleId)

          return resolvedPath === null ? null : fileUrl(resolvedPath)
        }

        const template = await readTemplate(templatePath)
        const rendered = template({color, name: appName, url})
        await writeFile(renderedPath, rendered)

        return renderedPath
      }

      async function deriveSource () {
        if (!inputDefinition) throw new Error(`Missing definition for input.${inputName}:\n${renderStack(stack)}`)

        const {strategy} = inputDefinition

        switch (strategy) {
          case INPUT_STRATEGY_COMPOSITE: return deriveCompositeSource()
          case INPUT_STRATEGY_DEGRADE: return deriveDegradeSource()
        }

        throw new Error('Not implemented')
      }

      async function deriveCompositeSource () {
        if (inputType === INPUT_TYPE_SVG) throw new Error(`SVG inputs cannot be composites:\n${renderStack(stack)}`)

        const template = await readInternalTemplate(TEMPLATE_COMPOSITE)
        const {options: {backgroundColor, layers, mask}} = inputDefinition

        const layersVariable = await Promise.all(layers.map(async layer => {
          const {input, multiplier, style} = layer

          const styleDefinition = style === null ? {} : styleDefinitions[style]

          if (!styleDefinition) throw new Error(`Missing definition for style.${style}:\n${renderStack(stack)}`)

          const url = fileUrl(await buildInput({
            name: input,
            type: INPUT_TYPE_IMAGE,
            size: applyMultiplier(inputSize, multiplier),
            stack: subStack,
          }))

          return {...layer, styleDefinition, url}
        }))

        let maskUrl

        if (mask !== null) {
          maskUrl = fileUrl(await buildInput({
            name: mask,
            type: INPUT_TYPE_SVG,
            size: inputSize,
            stack: subStack,
          }))
        }

        const rendered = template({
          backgroundColor,
          layers: layersVariable,
          maskUrl,
        })

        const renderedPath = buildCachePath(tempPath, `input.${inputName}.composite`, '.html', inputSize)
        await writeFile(renderedPath, rendered)

        return renderedPath
      }

      async function deriveDegradeSource () {
        const {options: {to}} = inputDefinition

        return buildInput({
          name: to,
          type: inputType,
          size: inputSize,
          stack: subStack,
        })
      }

      async function convertInputToImage (sourcePath) {
        if (isImagePath(sourcePath)) return sourcePath

        const imagePath = buildCachePath(tempPath, `input.${inputName}.image`, '.png', inputSize)
        const image = await screenshot(fileUrl(sourcePath), inputSize, {type: IMAGE_TYPE_PNG})
        await writeFile(imagePath, image)

        return imagePath
      }
    }
  }
}

function assertNonRecursive (request) {
  const {name, stack} = request

  const seen = [name]

  for (const frame of stack) {
    if (seen.includes(frame)) throw new Error(`Recursive definition found for input.${name}:\n${renderStack(stack)}`)

    seen.push(frame)
  }
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
