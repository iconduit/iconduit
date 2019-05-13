const browserslist = require('browserslist')

const {resolveSize} = require('./size.js')

module.exports = {
  resolveSizesForOutputs,
  selectOutputs,
}

function resolveSizesForOutputs (config, outputs) {
  const {definitions: {size: definitions}} = config
  const sizes = {}

  for (const name in outputs) {
    sizes[name] = resolveSizesForOutput(definitions, name, outputs[name])
  }

  return sizes
}

function resolveSizesForOutput (definitions, name, output) {
  const {sizes = []} = output

  return sizes.map(resolveSize.bind(null, definitions))
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

  return mapOutputNamesToDefinitions(names, output)
}

function selectBrowserOutputs (names, definitions, browser) {
  if (browser.length < 1) return

  const {all} = definitions

  selectDefinitionOutputs(names, all)

  const selectedBrowsers = new Set(
    browserslist(browser)
      .map(result => result.substring(0, result.indexOf(' ')))
  )

  for (const target of selectedBrowsers) {
    const definition = definitions[target]

    if (definition) selectDefinitionOutputs(names, definition)
  }
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
