const browserslist = require('browserslist')

module.exports = {
  selectOutputs,
}

function selectOutputs (config) {
  const {
    definitions: {
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

  const outputs = new Set()

  selectBrowserOutputs(outputs, browserDefinitions, browser)
  selectOutputsForCategory(outputs, 'installer', installerDefinitions, installer)
  selectOutputsForCategory(outputs, 'os', osDefinitions, os)
  selectOutputsForCategory(outputs, 'web', webDefinitions, web)

  return outputs
}

function selectBrowserOutputs (set, definitions, browser) {
  if (browser.length < 1) return

  const {all} = definitions

  selectDefinitionOutputs(set, all)

  const selectedBrowsers = new Set(
    browserslist(browser)
      .map(result => result.substring(0, result.indexOf(' ')))
  )

  for (const target of selectedBrowsers) {
    const definition = definitions[target]

    if (definition) selectDefinitionOutputs(set, definition)
  }
}

function selectOutputsForCategory (set, type, definitions, targets) {
  for (const target of targets) {
    const definition = definitions[target]

    if (!definition) throw new Error(`Unable to find definition for target.${type}.${target}`)

    selectDefinitionOutputs(set, definition)
  }
}

function selectDefinitionOutputs (set, definition) {
  const {outputs} = definition

  for (const output of outputs) set.add(output)
}
