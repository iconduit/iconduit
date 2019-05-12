const standardDeviceDefinitions = require('./definition/device.js')
const standardDisplayDefinitions = require('./definition/display.js')
const standardInputDefinitions = require('./definition/input.js')
const standardOutputDefinitions = require('./definition/output.js')
const standardSizeDefinitions = require('./definition/size.js')
const standardStyleDefinitions = require('./definition/style.js')
const standardTargetDefinitions = require('./definition/target.js')

module.exports = {
  normalize,
}

function normalize (config) {
  if (config === null || typeof config !== 'object') throw new Error('Invalid config')

  const {
    colors = {},
    definitions = {},
    inputs = {},
    name,
    targets = {},
  } = config

  assertNonEmptyString(name, 'name')

  return {
    colors: normalizeColors(colors),
    definitions: normalizeDefinitions(definitions),
    inputs: normalizeInputs(inputs),
    name,
    targets: normalizeTargets(targets),
  }
}

function normalizeColors (colors) {
  const {background, foreground} = colors

  assertNonEmptyString(background, 'colors.background')
  assertNonEmptyString(foreground, 'colors.foreground')

  const {
    mask = foreground,
    theme = background,
    tile = background,
  } = colors

  assertNonEmptyString(mask, 'colors.mask')
  assertNonEmptyString(theme, 'colors.theme')
  assertNonEmptyString(tile, 'colors.tile')

  return {
    background,
    foreground,
    mask,
    theme,
    tile,
  }
}

function normalizeDefinitions (definitions) {
  const {
    color = {},
    device = {},
    display = {},
    input = {},
    output = {},
    size = {},
    style = {},
    target = {},
  } = definitions

  assertObjectOfNonEmptyStrings(color, 'definitions.color')

  return {
    color,
    device: {...standardDeviceDefinitions, ...device},
    display: {...standardDisplayDefinitions, ...display},
    input: {...standardInputDefinitions, ...input},
    output: {...standardOutputDefinitions, ...output},
    size: {...standardSizeDefinitions, ...size},
    style: {...standardStyleDefinitions, ...style},
    target: {...standardTargetDefinitions, ...target},
  }
}

function normalizeInputs (inputs) {
  assertObjectOfNonEmptyStrings(inputs, 'inputs')

  return inputs
}

const DEFAULT_BROWSER_TARGET = 'not dead'

const INSTALLER_DMG = 'dmg'

const OS_IOS = 'ios'
const OS_MACOS = 'macos'
const OS_WINDOWS = 'windows'

const WEB_FACEBOOK = 'facebook'
const WEB_REDDIT = 'reddit'
const WEB_TWITTER = 'twitter'

function normalizeTargets (targets) {
  const {
    browser = [DEFAULT_BROWSER_TARGET],
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
  if (!value) throw new Error(`Missing value for ${setting}`)
}

function assertNonEmptyString (value, setting) {
  assertExists(value, setting)
  if (typeof value !== 'string') throw new Error(`Invalid value for ${setting}`)
}

function assertArrayOfNonEmptyStrings (value, setting) {
  assertExists(value, setting)
  if (!Array.isArray(value)) throw new Error(`Invalid value for ${setting}`)

  for (let index = 0; index < value.length; ++index) {
    if (typeof value[index] !== 'string') throw new Error(`Invalid value for ${setting}[${index}]`)
  }
}

function assertObjectOfNonEmptyStrings (value, setting) {
  assertExists(value, setting)
  if (value === null || typeof value !== 'object') throw new Error(`Invalid value for ${setting}`)

  for (const key in value) {
    if (typeof value[key] !== 'string') throw new Error(`Invalid value for ${setting}.${key}`)
  }
}
