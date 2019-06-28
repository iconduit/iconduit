const fileUrl = require('file-url')
const flat = require('array.prototype.flat')
const {dirname, extname, join} = require('path')

const {resolveColors} = require('./config/resolution.js')

const {
  EXTENSIONS_DOCUMENT,
  EXTENSIONS_IMAGE,
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_STRATEGY_SVG_TRANSFORM,
  INPUT_TYPE_DOCUMENT,
  INPUT_TYPE_RENDERABLE,
  INPUT_TYPE_SVG,
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
  readTemplate,
  transformSvg,
) {
  const {writeFile} = fileSystem

  const {resolveAsync: resolveDefaultInput} = createInputResolver(defaultInputDir, defaultInputDir)

  return function createInputBuilder (config, options) {
    const {
      definitions: {
        input: inputDefinitions,
        style: styleDefinitions,
      },
      inputs: userModuleIds,
      name: appName,
    } = config

    const {configPath, tempPath, userInputDir} = options

    const produceCached = createCache()
    const {resolveAsync: resolveUserInput} = createInputResolver(userInputDir, configPath)
    const color = resolveColors(config)

    return async function buildInput (request) {
      assertNonRecursive(request)

      const {
        isMasked,
        isTransparent,
        mask: maskName,
        name: inputName,
        stack,
        type: inputType,
      } = request

      const subStack = [`input.${inputName}`, ...stack]
      const maskedStatus = isMasked ? 'masked' : 'unmasked'
      const transparentStatus = isTransparent ? 'transparent' : 'opaque'
      const cacheKey = `input.${inputName}.${inputType}.${maskName}.${maskedStatus}.${transparentStatus}`

      const {[inputName]: inputDefinition} = inputDefinitions

      return produceCached(cacheKey, findSource)

      async function findSource () {
        return await findFileSource(inputName, inputType) || deriveSource()
      }

      async function deriveSource () {
        if (!inputDefinition) throw new Error(`Missing definition for input.${inputName}:\n${renderStack(stack)}`)

        const {strategy} = inputDefinition

        switch (strategy) {
          case INPUT_STRATEGY_COMPOSITE: return deriveCompositeSource()
          case INPUT_STRATEGY_DEGRADE: return deriveDegradeSource()
          case INPUT_STRATEGY_SVG_TRANSFORM: return deriveSvgTransformSource()
        }

        throw new Error('Not implemented')
      }

      async function deriveCompositeSource () {
        if (inputType === INPUT_TYPE_SVG) throw new Error(`SVG inputs cannot be composites:\n${renderStack(stack)}`)

        const maskUrl = fileUrl(await buildInput({name: maskName, type: INPUT_TYPE_SVG, stack: subStack}))

        const renderedPath = join(tempPath, `${cacheKey}.composite.html`)
        const template = await readInternalTemplate(TEMPLATE_COMPOSITE)

        const group = await buildInputGroup(request)
        const rendered = template({group, isMasked, isTransparent, maskUrl})

        await writeFile(renderedPath, rendered)

        return renderedPath
      }

      async function deriveDegradeSource () {
        const {options: {to}} = inputDefinition

        return buildInput({...request, name: to, stack: subStack})
      }

      async function deriveSvgTransformSource () {
        const {options: {input: transformInputName, maskColor, style}} = inputDefinition
        const styleDefinition = style === null ? {} : styleDefinitions[style]

        if (!styleDefinition) throw new Error(`Missing definition for style.${style}:\n${renderStack(stack)}`)

        const originalUrl = fileUrl(await buildInput({name: transformInputName, type: INPUT_TYPE_SVG, stack: subStack}))
        const transformedPath = join(tempPath, `${cacheKey}.transformed.svg`)

        const transformed = await transformSvg(originalUrl, {
          maskColor: color[maskColor] || maskColor,
          style: styleDefinition,
        })

        await writeFile(transformedPath, transformed)

        return transformedPath
      }
    }

    async function buildInputGroup (request) {
      assertNonRecursive(request)

      const {name: inputName, stack} = request
      const subStack = [`input.${inputName}`, ...stack]

      const {[inputName]: inputDefinition} = inputDefinitions

      return produceCached(`input.${inputName}.group`, async () => {
        const filePath = await findFileSource(inputName, INPUT_TYPE_RENDERABLE)

        return filePath ? buildFileInputGroup(filePath) : buildDerivedInputGroup()
      })

      function buildFileInputGroup (filePath) {
        return {
          isMasked: false,
          layers: [
            {
              style: {},
              type: isImagePath(filePath) ? 'image' : 'document',
              url: fileUrl(filePath),
            },
          ],
        }
      }

      async function buildDerivedInputGroup () {
        const {strategy} = inputDefinition

        switch (strategy) {
          case INPUT_STRATEGY_COMPOSITE: return buildCompositeInputGroup()
          case INPUT_STRATEGY_DEGRADE: return buildDegradeInputGroup()
        }

        throw new Error('Not implemented')
      }

      async function buildCompositeInputGroup () {
        const {options: {isMasked: isGroupMasked, layers: layerDefinitions}} = inputDefinition

        const layers = await Promise.all(layerDefinitions.map(async (layerDefinition, index) => {
          const {input, style} = layerDefinition

          const styleDefinition = style ? styleDefinitions[style] : {}

          if (!styleDefinition) throw new Error(`Missing definition for style.${style}:\n${renderStack(stack)}`)

          const hasStyle = Object.keys(styleDefinition).length > 0
          const group = await buildInputGroup({name: input, stack: subStack})

          if (hasStyle) return {style: styleDefinition, group}

          return group.layers
        }))

        return {isMasked: isGroupMasked, layers: flat(layers)}
      }

      async function buildDegradeInputGroup () {
        const {options: {to}} = inputDefinition

        return buildInputGroup({name: to, stack: subStack})
      }
    }

    async function findFileSource (inputName, inputType) {
      return produceCached(`input.${inputName}.${inputType}.file`, async () => {
        const filePath = await findFile(inputName)

        if (!filePath) return null

        if (isDocumentPath(filePath) && inputType !== INPUT_TYPE_DOCUMENT) {
          return buildDocumentInput(inputName, filePath)
        }

        return filePath
      })
    }

    async function findFile (inputName) {
      const {[inputName]: userModuleId} = userModuleIds

      if (userModuleId) {
        const resolvedPath = await resolveUserInput(userModuleId)

        if (!resolvedPath) {
          throw new Error(`Unable to resolve input for ${inputName} at ${userModuleId} from ${userInputDir}`)
        }

        return resolvedPath
      }

      const defaultModuleId = `./${inputName}`
      const inputPath = await resolveUserInput(defaultModuleId) || await resolveDefaultInput(defaultModuleId) || null

      return inputPath
    }

    async function buildDocumentInput (inputName, documentPath) {
      const renderedPath = join(tempPath, `input.${inputName}.rendered${extname(documentPath)}`)
      const {resolveSync: resolveTemplateInput} = createInputResolver(dirname(documentPath), documentPath)

      function url (moduleId) {
        const resolvedPath = resolveTemplateInput(moduleId)

        return resolvedPath === null ? null : fileUrl(resolvedPath)
      }

      const template = await readTemplate(documentPath)
      const rendered = template({color, name: appName, url})
      await writeFile(renderedPath, rendered)

      return renderedPath
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

function isDocumentPath (sourcePath) {
  return EXTENSIONS_DOCUMENT.includes(extname(sourcePath).toLowerCase())
}

function renderStack (stack) {
  return stack.map(frame => ` at ${frame}`).join('\n')
}
