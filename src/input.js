const fileUrl = require('file-url')
const {dirname, extname, join} = require('path')

const {resolveColors} = require('./config.js')

const {
  EXTENSIONS_IMAGE,
  EXTENSIONS_TEMPLATE,
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_TYPE_RENDERABLE,
  INPUT_TYPE_SVG,
  INPUT_TYPE_TEMPLATE,
  TEMPLATE_COMPOSITE,
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
  readTemplate
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

      const {isTransparent, mask, name: inputName, stack, type: inputType} = request
      const subStack = [`input.${inputName}`, ...stack]

      const {
        definitions: {
          input: {[inputName]: inputDefinition},
        },
        inputs: {[inputName]: userModuleId},
      } = config

      const {resolveAsync: resolveUserInput} = createInputResolver(userInputDir, configPath)

      const cacheKey = `input.${inputName}.${inputType}`
      const cachePath = get(cacheKey)

      if (cachePath) return cachePath

      const sourcePath = await findSource()
      set(cacheKey, sourcePath)

      return sourcePath

      async function findSource () {
        const sourceCacheKey = `input.${inputName}.source`
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
        const renderedPath = join(tempPath, `input.${inputName}.rendered${extname(templatePath)}`)
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
        const {options: {layers}} = inputDefinition

        const layersVariable = await Promise.all(layers.map(async layer => {
          const {input, style} = layer

          const styleDefinition = style === null ? {} : styleDefinitions[style]

          if (!styleDefinition) throw new Error(`Missing definition for style.${style}:\n${renderStack(stack)}`)

          const inputPath = await buildInput({
            isTransparent: true,
            mask: null,
            name: input,
            type: INPUT_TYPE_RENDERABLE,
            stack: subStack,
          })
          const layerType = isImagePath(inputPath) ? 'image' : 'document'
          const url = fileUrl(inputPath)

          return {style: styleDefinition, type: layerType, url}
        }))

        const maskUrl = mask && fileUrl(await buildInput({name: mask, type: INPUT_TYPE_SVG, stack: subStack}))

        const renderedPath = join(tempPath, `input.${inputName}.composite.html`)
        const rendered = template({group: {id: 'main', layers: layersVariable}, isTransparent, maskUrl})
        await writeFile(renderedPath, rendered)

        return renderedPath
      }

      async function deriveDegradeSource () {
        const {options: {to}} = inputDefinition

        return buildInput({
          name: to,
          type: inputType,
          stack: subStack,
        })
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
  return EXTENSIONS_IMAGE.includes(extname(sourcePath).toLowerCase())
}

function isTemplatePath (sourcePath) {
  return EXTENSIONS_TEMPLATE.includes(extname(sourcePath).toLowerCase())
}

function renderStack (stack) {
  return stack.map(frame => ` at ${frame}`).join('\n')
}
