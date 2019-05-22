const standardDeviceDefinitions = require('./definition/device.js')
const standardDisplayDefinitions = require('./definition/display.js')
const standardInputDefinitions = require('./definition/input.js')
const standardOutputDefinitions = require('./definition/output.js')
const standardSizeDefinitions = require('./definition/size.js')
const standardStyleDefinitions = require('./definition/style.js')
const standardTagDefinitions = require('./definition/tag.js')
const standardTargetDefinitions = require('./definition/target.js')

const {
  BROWSER_TARGET_DEFAULTS,
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INSTALLER_DMG,
  OS_IOS,
  OS_MACOS,
  OS_WINDOWS,
  WEB_FACEBOOK,
  WEB_REDDIT,
  WEB_TWITTER,
} = require('./constant.js')

const {
  all: standardAllTargetDefinition,
  browser: standardBrowserTargetDefinitions,
  installer: standardInstallerTargetDefinitions,
  os: standardOsTargetDefinitions,
  web: standardWebTargetDefinitions,
} = standardTargetDefinitions

module.exports = {
  normalize,
  resolveColors,
}

function normalize (config) {
  assertObject(config, 'config')

  const {
    applications = {},
    categories = [],
    colors = {},
    definitions = {},
    description = null,
    displayMode = 'standalone',
    iarcRatingId = null,
    inputs = {},
    language = null,
    name,
    orientation = null,
    outputs = {},
    preferRelatedApplications = null,
    scope = null,
    shortName = null,
    startUrl = null,
    targets = {},
    textDirection = 'auto',
  } = config

  assertOptionalNonEmptyString(description, 'description')
  assertNonEmptyString(displayMode, 'displayMode')
  assertOptionalNonEmptyString(iarcRatingId, 'iarcRatingId')
  assertOptionalNonEmptyString(language, 'language')
  assertNonEmptyString(name, 'name')
  assertOptionalNonEmptyString(orientation, 'orientation')
  assertOptionalBoolean(preferRelatedApplications, 'preferRelatedApplications')
  assertOptionalNonEmptyString(scope, 'scope')
  assertOptionalNonEmptyString(shortName, 'shortName')
  assertOptionalNonEmptyString(startUrl, 'startUrl')
  assertNonEmptyString(textDirection, 'textDirection')

  return {
    applications: normalizeApplications(applications),
    categories: normalizeCategories(categories),
    colors: normalizeColors(colors),
    definitions: normalizeDefinitions(definitions),
    description,
    displayMode,
    iarcRatingId,
    inputs: normalizeInputs(inputs),
    language,
    name,
    orientation,
    outputs: normalizeOutputs(outputs),
    preferRelatedApplications,
    scope,
    shortName,
    startUrl,
    targets: normalizeTargets(targets),
    textDirection,
  }
}

function resolveColors (config) {
  const {colors, definitions: {color}} = config

  const resolved = {}

  for (const colorType in colors) {
    const name = colors[colorType]
    const definition = color[name]

    resolved[colorType] = definition || name
  }

  return resolved
}

function normalizeApplications (applications) {
  assertObject(applications, 'applications')

  const {
    native = {},
    web = {},
  } = applications

  return {
    native: normalizeNativeApplications(native),
    web: normalizeWebApplications(web),
  }
}

function normalizeNativeApplications (native) {
  assertArray(native, 'applications.native')

  const normalized = []

  for (let index = 0; index < native.length; ++index) {
    const application = native[index]
    const applicationSetting = `applications.native[${index}]`

    assertObject(application, applicationSetting)

    const {
      fingerprints = [],
      id,
      minVersion = null,
      platform,
      url,
    } = application

    const hasId = typeof id !== 'undefined'
    const hasUrl = typeof url !== 'undefined'

    if (hasId) assertNonEmptyString(id, `${applicationSetting}.id`)
    if (hasUrl) assertNonEmptyString(url, `${applicationSetting}.url`)
    if (!hasId && !hasUrl) throw new Error(`Invalid value for ${applicationSetting}`)

    assertOptionalNonEmptyString(minVersion, `${applicationSetting}.minVersion`)
    assertNonEmptyString(platform, `${applicationSetting}.platform`)

    normalized[index] = {
      fingerprints: normalizeNativeApplicationFingerprints(fingerprints, `${applicationSetting}.fingerprints`),
      id,
      minVersion,
      platform,
      url: buildNativeApplicationUrl(url, platform, id),
    }
  }

  return normalized
}

function normalizeNativeApplicationFingerprints (fingerprints, setting) {
  assertArray(fingerprints, setting)

  const normalized = []

  for (let index = 0; index < fingerprints.length; ++index) {
    const fingerprint = fingerprints[index]
    const fingerprintSetting = `${setting}[${index}]`

    assertObject(fingerprint, fingerprintSetting)

    const {
      type,
      value,
    } = fingerprint

    assertNonEmptyString(type, `${fingerprintSetting}.type`)
    assertNonEmptyString(value, `${fingerprintSetting}.value`)

    normalized[index] = {
      type,
      value,
    }
  }

  return normalized
}

function buildNativeApplicationUrl (url, platform, id) {
  if (url) return url

  switch (platform) {
    case 'itunes': return `https://itunes.apple.com/app/id${encodeURIComponent(id)}`
    case 'play': return `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}`
    case 'windows': return `https://microsoft.com/p/app/${encodeURIComponent(id)}`
  }

  return null
}

function normalizeWebApplications (web) {
  assertArray(web, 'applications.web')

  const normalized = []

  for (let index = 0; index < web.length; ++index) {
    const application = web[index]
    const applicationSetting = `applications.web[${index}]`

    assertObject(application, applicationSetting)

    const {
      id,
      platform,
    } = application

    assertNonEmptyString(id, `${applicationSetting}.id`)
    assertNonEmptyString(platform, `${applicationSetting}.platform`)

    normalized[index] = {
      id,
      platform,
    }
  }

  return normalized
}

function normalizeCategories (categories) {
  assertArrayOfNonEmptyStrings(categories, 'categories')

  return Array
    .from(
      new Set(
        categories.map(category => category.toLowerCase())
      )
    )
    .sort()
}

function normalizeColors (colors) {
  assertObject(colors, 'colors')

  const {background} = colors

  assertNonEmptyString(background, 'colors.background')

  const {
    mask = background,
    theme = background,
    tile = background,
  } = colors

  assertNonEmptyString(mask, 'colors.mask')
  assertNonEmptyString(theme, 'colors.theme')
  assertNonEmptyString(tile, 'colors.tile')

  return {
    background,
    mask,
    theme,
    tile,
  }
}

function normalizeDefinitions (definitions) {
  assertObject(definitions, 'definitions')

  const {
    color: userColorDefinitions = {},
    device: userDeviceDefinitions = {},
    display: userDisplayDefinitions = {},
    input: userInputDefinitions = {},
    output: userOutputDefinitions = {},
    size: userSizeDefinitions = {},
    style: userStyleDefinitions = {},
    tag: userTagDefinitions = {},
    target: userTargetDefinitions = {},
  } = definitions

  assertObjectOfNonEmptyStrings(userColorDefinitions, 'definitions.color')

  const color = userColorDefinitions
  const device = {...standardDeviceDefinitions, ...userDeviceDefinitions}
  const display = {...standardDisplayDefinitions, ...userDisplayDefinitions}
  const input = normalizeInputDefinitions(userInputDefinitions)
  const output = normalizeOutputDefinitions(userOutputDefinitions)
  const size = normalizeSizeDefinitions(device, display, userSizeDefinitions)
  const style = {...standardStyleDefinitions, ...userStyleDefinitions}
  const tag = normalizeTagDefinitions(userTagDefinitions)
  const target = normalizeTargetDefinitions(userTargetDefinitions)

  return {
    color,
    device,
    display,
    input,
    output,
    size,
    style,
    tag,
    target,
  }
}

function normalizeInputDefinitions (input) {
  assertObject(input, 'definitions.input')

  const normalized = {...standardInputDefinitions}

  for (const inputName in input) {
    const definition = input[inputName]
    const inputSetting = `definitions.input.${inputName}`

    const {
      strategy,
      options = {},
    } = definition

    normalized[inputName] = {
      strategy,
      options: normalizeInputDefinitionOptions(strategy, options, inputSetting),
    }
  }

  return normalized
}

function normalizeInputDefinitionOptions (strategy, options, inputSetting) {
  const optionsSetting = `${inputSetting}.options`

  assertObject(options, optionsSetting)

  switch (strategy) {
    case INPUT_STRATEGY_COMPOSITE: return normalizeCompositeInputDefinitionOptions(options, optionsSetting)
    case INPUT_STRATEGY_DEGRADE: return normalizeDegradeInputDefinitionOptions(options, optionsSetting)
  }

  throw new Error(`Invalid value for ${inputSetting}.strategy`)
}

function normalizeCompositeInputDefinitionOptions (options, setting) {
  const {
    backgroundColor = 'transparent',
    layers,
    mask = null,
  } = options

  assertOptionalNonEmptyString(mask, `${setting}.mask`)

  return {
    backgroundColor,
    layers: normalizeCompositeInputDefinitionLayers(layers, `${setting}.layers`),
    mask,
  }
}

function normalizeCompositeInputDefinitionLayers (layers, setting) {
  assertNonEmptyArray(layers, setting)

  const normalized = []

  for (let index = 0; index < layers.length; ++index) {
    const layerSetting = `${setting}[${index}]`

    const {
      input,
      multiplier = 1,
      style = null,
    } = layers[index]

    assertNonEmptyString(input, `${layerSetting}.input`)
    assertInteger(multiplier, `${layerSetting}.multiplier`)
    assertOptionalNonEmptyString(style, `${layerSetting}.style`)

    normalized[index] = {
      input,
      multiplier,
      style,
    }
  }

  return normalized
}

function normalizeDegradeInputDefinitionOptions (options, setting) {
  const {
    to,
  } = options

  assertNonEmptyString(to, `${setting}.to`)

  return {
    to,
  }
}

function normalizeOutputDefinitions (output) {
  assertObject(output, 'definitions.output')

  const normalized = {...standardOutputDefinitions}

  for (const outputName in output) {
    const definition = output[outputName]
    const outputSetting = `definitions.output.${outputName}`

    assertObject(definition, outputSetting)

    const {
      input,
      name,
      options = {},
      sizes = [],
    } = definition

    assertNonEmptyString(input, `${outputSetting}.input`)
    assertNonEmptyString(name, `${outputSetting}.name`)
    assertArrayOfNonEmptyStrings(sizes, `${outputSetting}.sizes`)

    normalized[outputName] = {
      input,
      name,
      options: normalizeOutputDefinitionOptions(options, `${outputSetting}.options`),
      sizes,
    }
  }

  return normalized
}

function normalizeOutputDefinitionOptions (options, setting) {
  assertObject(options, setting)

  const {
    variables = {},
  } = options

  assertObject(variables, `${setting}.variables`)

  return {
    variables,
  }
}

function normalizeSizeDefinitions (device, display, size) {
  assertObject(size, 'definitions.size')

  const displaySizes = {}
  const deviceSizes = {}
  const userSizes = {}

  for (const displayName in display) {
    const {resolution: {horizontal, vertical}, pixelDensity, pixelRatio, orientation} = display[displayName]
    const orientationSize = {width: horizontal, height: vertical, pixelDensity, pixelRatio}
    const rotatedSize = {width: vertical, height: horizontal, pixelDensity, pixelRatio}
    const portraitSize = `display.${displayName}.portrait`
    const landscapeSize = `display.${displayName}.landscape`

    if (orientation === 'portrait') {
      displaySizes[portraitSize] = {key: `${displayName}.portrait`, ...orientationSize}
      displaySizes[landscapeSize] = {key: `${displayName}.landscape`, ...rotatedSize}
    } else if (orientation === 'landscape') {
      displaySizes[portraitSize] = {key: `${displayName}.portrait`, ...rotatedSize}
      displaySizes[landscapeSize] = {key: `${displayName}.landscape`, ...orientationSize}
    } else {
      throw new Error(`Invalid value for definitions.display.${displayName}.orientation`)
    }
  }

  for (const deviceName in device) {
    const {display: displayName} = device[deviceName]

    if (!display[displayName]) {
      throw new Error(`Missing definition for display.${displayName} in definitions.device.${displayName}.display`)
    }

    const {key: portraitKey, ...portraitSize} = displaySizes[`display.${displayName}.portrait`]
    const {key: landscapeKey, ...landscapeSize} = displaySizes[`display.${displayName}.landscape`]

    deviceSizes[`device.${deviceName}.portrait`] = {key: `${deviceName}.portrait`, ...portraitSize}
    deviceSizes[`device.${deviceName}.landscape`] = {key: `${deviceName}.landscape`, ...landscapeSize}
  }

  for (const name in size) {
    const userSize = size[name]
    const sizeSetting = `definitions.size.${name}`

    assertObject(userSize, sizeSetting)

    const {
      key,
      width,
      height,
      pixelDensity = 72,
      pixelRatio = 1,
    } = size[name]

    assertNonEmptyString(key, `${sizeSetting}.key`)
    assertInteger(width, `${sizeSetting}.width`)
    assertInteger(height, `${sizeSetting}.height`)
    assertInteger(pixelDensity, `${sizeSetting}.pixelDensity`)
    assertInteger(pixelRatio, `${sizeSetting}.pixelRatio`)

    userSizes[name] = {
      key,
      width,
      height,
      pixelDensity,
      pixelRatio,
    }
  }

  return {...displaySizes, ...deviceSizes, ...standardSizeDefinitions, ...userSizes}
}

function normalizeTagDefinitions (tag) {
  assertObject(tag, 'definitions.tag')

  const normalized = {...standardTagDefinitions}

  for (const name in tag) {
    normalized[name] = normalizeTagDefinition(tag[name], `definitions.tag.${name}`)
  }

  return normalized
}

function normalizeTagDefinition (definition, setting) {
  assertObject(definition, setting)

  const normalized = {}

  for (const section in definition) {
    const sectionSetting = `${setting}.${section}`

    assertNonEmptyString(section, sectionSetting)

    normalized[section] = normalizeTags(definition[section], sectionSetting)
  }

  return normalized
}

function normalizeTags (tags, setting) {
  assertArray(tags, setting)

  const normalized = []

  for (let index = 0; index < tags.length; ++index) {
    normalized[index] = normalizeTag(tags[index], `${setting}[${index}]`)
  }

  return normalized
}

function normalizeTag (definition, setting) {
  assertObject(definition, setting)

  const {
    attributes = {},
    children = [],
    isVoid = false,
    tag,
  } = definition

  assertBoolean(isVoid, `${setting}.isVoid`)
  assertNonEmptyString(tag, `${setting}.tag`)

  return {
    attributes: normalizeTagAttributes(attributes, `${setting}.attributes`),
    children: normalizeTags(children, `${setting}.children`),
    isVoid,
    tag,
  }
}

function normalizeTagAttributes (attributes, setting) {
  assertObject(attributes, setting)

  const normalized = {}

  for (const name in attributes) {
    const value = attributes[name]
    const attributeSetting = `${setting}.${name}`

    if (typeof value === 'string') {
      assertNonEmptyString(value, attributeSetting)
    } else {
      assertReference(value, attributeSetting)
    }

    normalized[name] = value
  }

  return normalized
}

function normalizeTargetDefinitions (target) {
  assertObject(target, 'definitions.target')

  const {
    all = standardAllTargetDefinition,
    browser = {},
    installer = {},
    os = {},
    web = {},
  } = target

  return {
    all: normalizeTargetDefinition(all, 'definitions.target.all'),
    browser: normalizeTargetDefinitionCategory(
      standardBrowserTargetDefinitions,
      browser,
      'definitions.target.browser'
    ),
    installer: normalizeTargetDefinitionCategory(
      standardInstallerTargetDefinitions,
      installer,
      'definitions.target.installer'
    ),
    os: normalizeTargetDefinitionCategory(
      standardOsTargetDefinitions,
      os,
      'definitions.target.os'
    ),
    web: normalizeTargetDefinitionCategory(
      standardWebTargetDefinitions,
      web,
      'definitions.target.web'
    ),
  }
}

function normalizeTargetDefinitionCategory (standardDefinitions, definitions, setting) {
  assertObject(definitions, setting)

  const normalized = {}

  for (const name in definitions) {
    normalized[name] = normalizeTargetDefinition(definitions[name], `${setting}.${name}`)
  }

  return {...standardDefinitions, ...normalized}
}

function normalizeTargetDefinition (definition, setting) {
  assertObject(definition, setting)

  const {
    outputs = [],
  } = definition

  assertArrayOfNonEmptyStrings(outputs, `${setting}.outputs`)

  return {
    outputs,
  }
}

function normalizeInputs (inputs) {
  assertObjectOfNonEmptyStrings(inputs, 'inputs')

  return inputs
}

function normalizeOutputs (outputs) {
  const {
    include = [],
    exclude = [],
  } = outputs

  assertArrayOfNonEmptyStrings(include, 'outputs.include')
  assertArrayOfNonEmptyStrings(exclude, 'outputs.exclude')

  return {
    include,
    exclude,
  }
}

function normalizeTargets (targets) {
  assertObject(targets, 'targets')

  const {
    browser = [BROWSER_TARGET_DEFAULTS],
    installer = [INSTALLER_DMG],
    os = [OS_IOS, OS_MACOS, OS_WINDOWS],
    web = [WEB_FACEBOOK, WEB_REDDIT, WEB_TWITTER],
  } = targets

  assertArrayOfNonEmptyStrings(browser, 'targets.browser')
  assertArrayOfNonEmptyStrings(installer, 'targets.installer')
  assertArrayOfNonEmptyStrings(os, 'targets.os')
  assertArrayOfNonEmptyStrings(web, 'targets.web')

  return {
    browser,
    installer,
    os,
    web,
  }
}

function assertExists (value, setting) {
  if (value === null || typeof value === 'undefined') throw new Error(`Missing value for ${setting}`)
}

function assertNonEmptyString (value, setting) {
  assertExists(value, setting)
  if (typeof value !== 'string') throw new Error(`Invalid value for ${setting}`)
}

function assertOptionalNonEmptyString (value, setting) {
  if (value === null) return
  if (typeof value !== 'string') throw new Error(`Invalid value for ${setting}`)
}

function assertInteger (value, setting) {
  assertExists(value, setting)
  if (!Number.isInteger(value)) throw new Error(`Invalid value for ${setting}`)
}

function assertBoolean (value, setting) {
  if (value !== true && value !== false) throw new Error(`Invalid value for ${setting}`)
}

function assertOptionalBoolean (value, setting) {
  if (value === null) return
  assertBoolean(value, setting)
}

function assertArray (value, setting) {
  assertExists(value, setting)
  if (!Array.isArray(value)) throw new Error(`Invalid value for ${setting}`)
}

function assertNonEmptyArray (value, setting) {
  assertArray(value, setting)
  if (value.length < 1) throw new Error(`Invalid value for ${setting}`)
}

function assertArrayOfNonEmptyStrings (value, setting) {
  assertArray(value, setting)

  for (let index = 0; index < value.length; ++index) {
    if (typeof value[index] !== 'string') throw new Error(`Invalid value for ${setting}[${index}]`)
  }
}

function assertObject (value, setting) {
  assertExists(value, setting)
  if (typeof value !== 'object') throw new Error(`Invalid value for ${setting}`)
}

function assertObjectOfNonEmptyStrings (value, setting) {
  assertObject(value, setting)

  for (const key in value) {
    if (typeof value[key] !== 'string') throw new Error(`Invalid value for ${setting}.${key}`)
  }
}

function assertReference (value, setting) {
  assertObject(value, setting)
  assertNonEmptyString(value.$ref, setting)
}
