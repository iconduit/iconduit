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

  for (const definition of Object.values(definitions)) {
    const {outputs} = definition

    for (const output of outputs) set.add(output)
  }
}

function selectOutputsForCategory (set, type, definitions, targets) {
  for (const target of targets) {
    const definition = definitions[target]

    if (!definition) throw new Error(`Unable to find definition for target.${type}.${target}`)

    const {outputs} = definition

    for (const output of outputs) set.add(output)
  }
}
