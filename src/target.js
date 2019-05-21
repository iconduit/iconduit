const browserslist = require('browserslist')

module.exports = {
  outputNames,
  selectOutputs,
  targetNames,
}

function outputNames (outputs) {
  return Object.keys(outputs).sort()
}

function selectOutputs (config) {
  const {
    definitions: {
      output,
      target: {
        browser: browserDefinitions,
        installer: installerDefinitions,
        os: osDefinitions,
        web: webDefinitions,
      },
    },
    outputs: {
      include,
      exclude,
    },
    targets: {
      browser,
      installer,
      os,
      web,
    },
  } = config

  const names = new Set()

  selectBrowserOutputs(names, browserDefinitions, browser)
  selectOutputsForCategory(names, 'installer', installerDefinitions, installer)
  selectOutputsForCategory(names, 'os', osDefinitions, os)
  selectOutputsForCategory(names, 'web', webDefinitions, web)

  include.forEach(output => names.add(output))
  exclude.forEach(output => names.delete(output))

  return mapOutputNamesToDefinitions(names, output)
}

function targetNames (config) {
  const {
    definitions: {
      target: {
        browser: definitions,
      },
    },
    targets: {
      browser,
      installer,
      os,
      web,
    },
  } = config

  const names = [
    ...selectBrowsers(browser, definitions).map(name => `browser.${name}`),
    ...installer.map(name => `installer.${name}`),
    ...os.map(name => `os.${name}`),
    ...web.map(name => `web.${name}`),
  ]

  return names.sort()
}

function selectBrowserOutputs (names, definitions, browser) {
  if (browser.length < 1) return

  const {all} = definitions

  selectDefinitionOutputs(names, all)

  for (const target of selectBrowsers(browser, definitions)) {
    selectDefinitionOutputs(names, definitions[target])
  }
}

function selectBrowsers (browser, definitions) {
  const selected = new Set(
    browserslist(browser)
      .map(result => result.substring(0, result.indexOf(' ')))
  )

  return Array.from(selected).filter(name => definitions[name])
}

function selectOutputsForCategory (names, type, definitions, targets) {
  for (const target of targets) {
    const definition = definitions[target]

    if (!definition) throw new Error(`Unable to find definition for target.${type}.${target}`)

    selectDefinitionOutputs(names, definition)
  }
}

function selectDefinitionOutputs (names, definition) {
  const {outputs} = definition

  for (const output of outputs) names.add(output)
}

function mapOutputNamesToDefinitions (names, definitions) {
  const mapped = {}

  for (const name of names) {
    const definition = definitions[name]

    if (!definition) throw new Error(`Unable to find definition for output.${name}`)

    mapped[name] = definition
  }

  return mapped
}
