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

      const {isTransparent, mask, name: inputName, stack, type: inputType} = request
      const subStack = [`input.${inputName}`, ...stack]

      const {[inputName]: inputDefinition} = inputDefinitions

      return produceCached(`input.${inputName}.${inputType}`, findSource)

      async function findSource () {
        return await findFileSource(inputName, inputType) || deriveSource()
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

        const maskUrl = fileUrl(await buildInput({name: mask, type: INPUT_TYPE_SVG, stack: subStack}))

        const renderedPath = join(tempPath, `input.${inputName}.composite.html`)
        const template = await readInternalTemplate(TEMPLATE_COMPOSITE)

        const group = await buildInputGroup({name: inputName, stack})
        const rendered = template({group, isTransparent, maskUrl})

        await writeFile(renderedPath, rendered)

        return renderedPath
      }

      async function deriveDegradeSource () {
        const {options: {to}} = inputDefinition

        return buildInput({...request, name: to, stack: subStack})
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
        const {options: {isMasked, layers: layerDefinitions}} = inputDefinition

        const layers = await Promise.all(layerDefinitions.map(async (layerDefinition, index) => {
          const {input, style} = layerDefinition

          const styleDefinition = style === null ? {} : styleDefinitions[style]

          if (!styleDefinition) throw new Error(`Missing definition for style.${style}:\n${renderStack(stack)}`)

          const hasStyle = Object.keys(styleDefinition).length > 0
          const group = await buildInputGroup({name: input, stack: subStack})

          if (hasStyle) return {style: styleDefinition, group}

          return group.layers
        }))

        return {isMasked, layers: layers.flat()}
      }

      async function buildDegradeInputGroup () {
        const {options: {to}} = inputDefinition

        return buildInputGroup({name: to, stack: subStack})
      }
    }

    async function findFileSource (inputName, inputType) {
      return produceCached(`input.${inputName}.file`, async () => {
        const filePath = await findFile(inputName)

        if (!filePath) return null

        if (isTemplatePath(filePath) && inputType !== INPUT_TYPE_TEMPLATE) {
          return buildTemplateInput(inputName, filePath)
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

    async function buildTemplateInput (inputName, templatePath) {
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
