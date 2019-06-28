const isSelfClosingFn = require('is-self-closing')
const {toDirUrl} = require('@iconduit/consumer')

const standardDeviceDefinitions = require('../definition/device.js')
const standardDisplayDefinitions = require('../definition/display.js')
const standardInputDefinitions = require('../definition/input.js')
const standardOutputDefinitions = require('../definition/output.js')
const standardSizeDefinitions = require('../definition/size.js')
const standardStyleDefinitions = require('../definition/style.js')
const standardTagDefinitions = require('../definition/tag.js')
const standardTargetDefinitions = require('../definition/target.js')

const {
  all: standardAllTargetDefinition,
  browser: standardBrowserTargetDefinitions,
  installer: standardInstallerTargetDefinitions,
  os: standardOsTargetDefinitions,
  web: standardWebTargetDefinitions,
} = standardTargetDefinitions

module.exports = {
  createConfigNormalizer,
}

function createConfigNormalizer (validateConfig) {
  return function normalizeConfig (config) {
    assertObject(config, 'config')

    const {
      definitions = {},
    } = config

    return applyNormalization(
      applyDefaults(
        validateConfig({
          ...config,

          definitions: mergeDefinitions(definitions),
        }),
      ),
    )
  }
}

function mergeDefinitions (definitions) {
  assertObject(definitions, 'definitions')

  const {
    color = {},
    device: userDevice = {},
    display: userDisplay = {},
    input = {},
    output = {},
    size = {},
    style = {},
    tag = {},
    target = {},
  } = definitions

  assertObject(target, 'definitions.target')

  const device = {...standardDeviceDefinitions, ...userDevice}
  const display = {...standardDisplayDefinitions, ...userDisplay}
  const autoSizes = buildAutoSizes(display, device)

  const {
    all = standardAllTargetDefinition,
    browser = {},
    installer = {},
    os = {},
    web = {},
  } = target

  return {
    color,
    device,
    display,
    input: {...standardInputDefinitions, ...input},
    output: {...standardOutputDefinitions, ...output},
    size: {...autoSizes, ...standardSizeDefinitions, ...size},
    style: {...standardStyleDefinitions, ...style},
    tag: {...standardTagDefinitions, ...tag},
    target: {
      all,
      browser: {...standardBrowserTargetDefinitions, ...browser},
      installer: {...standardInstallerTargetDefinitions, ...installer},
      os: {...standardOsTargetDefinitions, ...os},
      web: {...standardWebTargetDefinitions, ...web},
    },
  }
}

function buildAutoSizes (display, device) {
  assertObject(display, 'definitions.display')
  assertObject(device, 'definitions.device')

  const displaySizes = {}
  const deviceSizes = {}

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

  return {...displaySizes, ...deviceSizes}
}

function applyDefaults (config) {
  const {
    applications,
    colors,
    definitions,
    name,
    shortName,
  } = config

  return {
    ...config,

    applications: applyApplicationsDefaults(applications),
    colors: applyColorsDefaults(colors),
    definitions: applyDefinitionsDefaults(definitions),
    shortName: shortName || name,
  }
}

function applyApplicationsDefaults (applications) {
  const {
    native,
  } = applications

  return {
    ...applications,

    native: native.map(applyNativeApplicationDefaults),
  }
}

function applyNativeApplicationDefaults (application) {
  const {
    platform,
    id,
    url,
  } = application

  return {
    ...application,

    url: url || buildNativeApplicationUrl(platform, id),
  }
}

function buildNativeApplicationUrl (platform, id) {
  switch (platform) {
    case 'itunes': return `https://itunes.apple.com/app/id${encodeURIComponent(id)}`
    case 'play': return `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}`
    case 'windows': return `https://microsoft.com/p/app/${encodeURIComponent(id)}`
  }

  return null
}

function applyColorsDefaults (colors) {
  const {
    background,
    brand,
    mask,
    theme,
    tile,
  } = colors

  return {
    ...colors,

    background: background || brand,
    mask: mask || brand,
    theme: theme || brand,
    tile: tile || brand,
  }
}

function applyDefinitionsDefaults (definitions) {
  const {
    output,
    tag,
  } = definitions

  return {
    ...definitions,

    output: applyOutputDefinitionsDefaults(output),
    tag: applyTagDefinitionsDefaults(tag),
  }
}

function applyOutputDefinitionsDefaults (output) {
  const defaulted = {}

  for (const outputName in output) {
    const definition = output[outputName]

    const {
      input,
    } = definition

    defaulted[outputName] = {
      ...definition,

      input: input || outputName,
    }
  }

  return defaulted
}

function applyTagDefinitionsDefaults (tag) {
  const defaulted = {}

  for (const tagName in tag) {
    const defaultedSections = {}
    const sections = tag[tagName]

    for (const section in sections) {
      defaultedSections[section] = applyTagListDefaults(sections[section])
    }

    defaulted[tagName] = defaultedSections
  }

  return defaulted
}

function applyTagListDefaults (tagList) {
  return tagList.map(applyTagDefaults)
}

function applyTagDefaults (tag) {
  const {
    children,
    isSelfClosing,
    tag: tagName,
  } = tag

  return {
    ...tag,

    children: applyTagListDefaults(children),
    isSelfClosing: typeof isSelfClosing === 'boolean' ? isSelfClosing : isSelfClosingFn(tagName),
  }
}

function applyNormalization (config) {
  const {
    urls,
  } = config

  return {
    ...config,

    urls: applyUrlsNormalization(urls),
  }
}

function applyUrlsNormalization (urls) {
  const {
    base,
    output,
    scope,
    start,
  } = urls

  return {
    base: toDirUrl(base),
    output: toDirUrl(output),
    scope: toDirUrl(scope),
    start,
  }
}

function assertObject (value, setting) {
  if (value === null || typeof value !== 'object') throw new Error(`Invalid value for ${setting}`)
}
