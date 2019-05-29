const isSelfClosingFn = require('is-self-closing')

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
  WEB_GITHUB,
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

function normalize (configOrFn) {
  const config = typeof configOrFn === 'function' ? configOrFn() : configOrFn

  assertObject(config, 'config')

  const {
    name,
  } = config

  assertNonEmptyString(name, 'name')

  const {
    applications = {},
    categories = [],
    colors = {},
    definitions = {},
    description = null,
    displayMode = 'standalone',
    iarcRatingId = null,
    inputs = {},
    language = 'en-US',
    orientation = null,
    os = {},
    outputPath = 'dist',
    outputs = {},
    preferRelatedApplications = null,
    scope = null,
    shortName = name,
    startUrl = '.',
    tags = {},
    targets = {},
    textDirection = 'auto',
    url = null,
    viewport = 'width=device-width, initial-scale=1',
  } = config

  assertOptionalNonEmptyString(description, 'description')
  assertNonEmptyString(displayMode, 'displayMode')
  assertOptionalNonEmptyString(iarcRatingId, 'iarcRatingId')
  assertNonEmptyString(language, 'language')
  assertOptionalNonEmptyString(orientation, 'orientation')
  assertNonEmptyString(outputPath, 'outputPath')
  assertOptionalBoolean(preferRelatedApplications, 'preferRelatedApplications')
  assertOptionalNonEmptyString(scope, 'scope')
  assertNonEmptyString(shortName, 'shortName')
  assertNonEmptyString(startUrl, 'startUrl')
  assertNonEmptyString(textDirection, 'textDirection')
  assertOptionalNonEmptyString(url, 'url')
  assertNonEmptyString(viewport, 'viewport')

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
    os: normalizeOs(os),
    outputPath,
    outputs: normalizeOutputs(outputs),
    preferRelatedApplications,
    scope,
    shortName,
    startUrl: startUrl || url,
    tags: normalizeTags(tags),
    targets: normalizeTargets(targets),
    textDirection,
    url,
    viewport,
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
    native = [],
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
      country = 'US',
      fingerprints = [],
      id,
      launchUrl = null,
      minVersion = null,
      platform,
      url,
    } = application

    const hasId = typeof id !== 'undefined'
    const hasUrl = typeof url !== 'undefined'

    if (hasId) assertNonEmptyString(id, `${applicationSetting}.id`)
    if (hasUrl) assertNonEmptyString(url, `${applicationSetting}.url`)
    if (!hasId && !hasUrl) throw new Error(`Invalid value for ${applicationSetting}`)

    assertNonEmptyString(country, `${applicationSetting}.country`)
    assertOptionalNonEmptyString(launchUrl, `${applicationSetting}.launchUrl`)
    assertOptionalNonEmptyString(minVersion, `${applicationSetting}.minVersion`)
    assertNonEmptyString(platform, `${applicationSetting}.platform`)

    normalized[index] = {
      country,
      fingerprints: normalizeNativeApplicationFingerprints(fingerprints, `${applicationSetting}.fingerprints`),
      id,
      launchUrl,
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
  assertObject(web, 'applications.web')

  const {
    facebook = {},
    openGraph = {},
    twitter = {},
  } = web

  return {
    facebook: normalizeFacebookWebApplication(facebook, 'applications.web.facebook'),
    openGraph: normalizeOpenGraphWebApplication(openGraph, 'applications.web.openGraph'),
    twitter: normalizeTwitterWebApplication(twitter, 'applications.web.twitter'),
  }
}

function normalizeFacebookWebApplication (application, setting) {
  assertObject(application, setting)

  const {
    appId = null,
  } = application

  assertOptionalNonEmptyString(appId, `${setting}.appId`)

  return {
    appId,
  }
}

function normalizeOpenGraphWebApplication (application, setting) {
  assertObject(application, setting)

  const {
    determiner = null,
  } = application

  assertOptionalNonEmptyString(determiner, `${setting}.determiner`)

  return {
    determiner,
  }
}

function normalizeTwitterWebApplication (application, setting) {
  assertObject(application, setting)

  const {
    cardType = 'summary_large_image',
    creatorHandle = null,
    siteHandle = null,
  } = application

  assertNonEmptyString(cardType, `${setting}.cardType`)
  assertOptionalNonEmptyString(creatorHandle, `${setting}.creatorHandle`)
  assertOptionalNonEmptyString(siteHandle, `${setting}.siteHandle`)

  return {
    cardType,
    creatorHandle,
    siteHandle,
  }
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

  const {brand} = colors

  assertNonEmptyString(brand, 'colors.brand')

  const {
    background = brand,
    mask = brand,
    theme = brand,
    tile = brand,
  } = colors

  assertNonEmptyString(background, 'colors.background')
  assertNonEmptyString(mask, 'colors.mask')
  assertNonEmptyString(theme, 'colors.theme')
  assertNonEmptyString(tile, 'colors.tile')

  return {
    background,
    brand,
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
  const input = normalizeInputDefinitions({...standardInputDefinitions, ...userInputDefinitions})
  const output = normalizeOutputDefinitions({...standardOutputDefinitions, ...userOutputDefinitions})
  const size = normalizeSizeDefinitions(device, display, {...standardSizeDefinitions, ...userSizeDefinitions})
  const style = {...standardStyleDefinitions, ...userStyleDefinitions}
  const tag = normalizeTagDefinitions({...standardTagDefinitions, ...userTagDefinitions})
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

  const normalized = {}

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

  const normalized = {}

  for (const outputName in output) {
    const definition = output[outputName]
    const outputSetting = `definitions.output.${outputName}`

    assertObject(definition, outputSetting)

    const {
      input = outputName,
      name,
      options = {},
      sizes = [],
      tags = [],
    } = definition

    assertNonEmptyString(input, `${outputSetting}.input`)
    assertNonEmptyString(name, `${outputSetting}.name`)
    assertArrayOfNonEmptyStrings(sizes, `${outputSetting}.sizes`)
    assertArrayOfNonEmptyStrings(tags, `${outputSetting}.tags`)

    normalized[outputName] = {
      input,
      name,
      options: normalizeOutputDefinitionOptions(options, `${outputSetting}.options`),
      sizes,
      tags,
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
  const otherSizes = {}

  for (const displayName in display) {
    const {resolution: {horizontal, vertical}, pixelDensity, pixelRatio, orientation} = display[displayName]
    const deviceWidth = horizontal / pixelRatio
    const deviceHeight = vertical / pixelRatio

    const orientationSize = {
      width: horizontal,
      height: vertical,
      deviceWidth,
      deviceHeight,
      pixelDensity,
      pixelRatio,
    }

    const rotatedSize = {
      width: vertical,
      height: horizontal,
      deviceWidth,
      deviceHeight,
      pixelDensity,
      pixelRatio,
    }

    const portraitSize = `display.${displayName}.portrait`
    const landscapeSize = `display.${displayName}.landscape`

    if (orientation === 'portrait') {
      displaySizes[portraitSize] = {key: `${displayName}.portrait`, ...orientationSize, orientation: 'portrait'}
      displaySizes[landscapeSize] = {key: `${displayName}.landscape`, ...rotatedSize, orientation: 'landscape'}
    } else if (orientation === 'landscape') {
      displaySizes[portraitSize] = {key: `${displayName}.portrait`, ...rotatedSize, orientation: 'portrait'}
      displaySizes[landscapeSize] = {key: `${displayName}.landscape`, ...orientationSize, orientation: 'landscape'}
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
      deviceWidth = null,
      deviceHeight = null,
      orientation = null,
      pixelDensity = 72,
      pixelRatio = 1,
    } = size[name]

    assertNonEmptyString(key, `${sizeSetting}.key`)
    assertInteger(width, `${sizeSetting}.width`)
    assertInteger(height, `${sizeSetting}.height`)
    assertOptionalInteger(deviceWidth, `${sizeSetting}.deviceWidth`)
    assertOptionalInteger(deviceHeight, `${sizeSetting}.deviceHeight`)
    assertOptionalNonEmptyString(orientation, `${sizeSetting}.orientation`)
    assertInteger(pixelDensity, `${sizeSetting}.pixelDensity`)
    assertInteger(pixelRatio, `${sizeSetting}.pixelRatio`)

    otherSizes[name] = {
      key,
      width,
      height,
      deviceWidth,
      deviceHeight,
      orientation,
      pixelDensity,
      pixelRatio,
    }
  }

  return {...displaySizes, ...deviceSizes, ...otherSizes}
}

function normalizeTagDefinitions (tag) {
  assertObject(tag, 'definitions.tag')

  const normalized = {}

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

    normalized[section] = normalizeTagList(definition[section], sectionSetting)
  }

  return normalized
}

function normalizeTagList (tags, setting) {
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
    isSelfClosing = null,
    predicate = [],
    sortWeight = 0,
    tag,
  } = definition

  assertOptionalBoolean(isSelfClosing, `${setting}.isSelfClosing`)
  assertArrayOfFunctions(predicate, `${setting}.predicate`)
  assertInteger(sortWeight, `${setting}.sortWeight`)
  assertOptionalNonEmptyString(tag, `${setting}.tag`)
  assertNonEmptyString(tag, `${setting}.tag`)

  const tagLowerCase = tag.toLowerCase()
  const isSelfClosingNormalized = isSelfClosing === null ? isSelfClosingFn(tagLowerCase) : isSelfClosing

  return {
    attributes: normalizeTagAttributes(attributes, `${setting}.attributes`),
    children: normalizeTagList(children, `${setting}.children`),
    isSelfClosing: isSelfClosingNormalized,
    predicate,
    sortWeight,
    tag: tagLowerCase,
  }
}

function normalizeTagAttributes (attributes, setting) {
  assertObject(attributes, setting)

  const normalized = {}

  for (const name in attributes) {
    const value = attributes[name]

    assertStringOrFunction(value, `${setting}.${name}`)

    normalized[name.toLowerCase()] = value
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
      {...standardBrowserTargetDefinitions, ...browser},
      'definitions.target.browser'
    ),
    installer: normalizeTargetDefinitionCategory(
      {...standardInstallerTargetDefinitions, ...installer},
      'definitions.target.installer'
    ),
    os: normalizeTargetDefinitionCategory(
      {...standardOsTargetDefinitions, ...os},
      'definitions.target.os'
    ),
    web: normalizeTargetDefinitionCategory(
      {...standardWebTargetDefinitions, ...web},
      'definitions.target.web'
    ),
  }
}

function normalizeTargetDefinitionCategory (definitions, setting) {
  assertObject(definitions, setting)

  const normalized = {}

  for (const name in definitions) {
    normalized[name] = normalizeTargetDefinition(definitions[name], `${setting}.${name}`)
  }

  return normalized
}

function normalizeTargetDefinition (definition, setting) {
  assertObject(definition, setting)

  const {
    outputs = [],
    tags = [],
  } = definition

  assertArrayOfNonEmptyStrings(outputs, `${setting}.outputs`)
  assertArrayOfNonEmptyStrings(tags, `${setting}.tags`)

  return {
    outputs,
    tags,
  }
}

function normalizeInputs (inputs) {
  assertObjectOfNonEmptyStrings(inputs, 'inputs')

  return inputs
}

function normalizeOs (os) {
  assertObject(os, 'os')

  const {
    ios = {},
  } = os

  return {
    ios: normalizeOsIos(ios),
  }
}

function normalizeOsIos (ios) {
  assertObject(ios, 'os.ios')

  const {
    statusBarStyle = null,
  } = ios

  assertOptionalNonEmptyString(statusBarStyle, 'os.ios.statusBarStyle')

  return {
    statusBarStyle,
  }
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

function normalizeTags (tags) {
  const {
    include = [],
    exclude = [],
  } = tags

  assertArrayOfNonEmptyStrings(include, 'tags.include')
  assertArrayOfNonEmptyStrings(exclude, 'tags.exclude')

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
    web = [WEB_FACEBOOK, WEB_GITHUB, WEB_REDDIT, WEB_TWITTER],
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

function assertOptionalInteger (value, setting) {
  if (value === null) return
  assertInteger(value, setting)
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
    assertNonEmptyString(value[index], `Invalid value for ${setting}[${index}]`)
  }
}

function assertArrayOfFunctions (value, setting) {
  assertArray(value, setting)

  for (let index = 0; index < value.length; ++index) {
    assertFunction(value[index], `Invalid value for ${setting}[${index}]`)
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

function assertFunction (value, setting) {
  if (typeof value !== 'function') throw new Error(`Invalid value for ${setting}`)
}

function assertStringOrFunction (value, setting) {
  if (typeof value === 'string') {
    assertNonEmptyString(value, setting)
  } else {
    assertFunction(value, setting)
  }
}
