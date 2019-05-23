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
      tag,
      target: {
        all: {outputs: baseOutputs, tags: baseTags},
        browser: browserDefinitions,
        installer: installerDefinitions,
        os: osDefinitions,
        web: webDefinitions,
      },
    },
    outputs: {
      include: includeOutputs,
      exclude: excludeOutputs,
    },
    tags: {
      include: includeTags,
      exclude: excludeTags,
    },
    targets: {
      browser,
      installer,
      os,
      web,
    },
  } = config

  const outputNames = new Set(baseOutputs)
  const tagNames = new Set(baseTags)

  selectBrowserOutputs(outputNames, tagNames, browserDefinitions, browser)
  selectOutputsForCategory(outputNames, tagNames, 'installer', installerDefinitions, installer)
  selectOutputsForCategory(outputNames, tagNames, 'os', osDefinitions, os)
  selectOutputsForCategory(outputNames, tagNames, 'web', webDefinitions, web)

  includeOutputs.forEach(outputName => outputNames.add(outputName))
  excludeOutputs.forEach(outputName => outputNames.delete(outputName))
  includeTags.forEach(tagName => tagNames.add(tagName))
  excludeTags.forEach(tagName => tagNames.delete(tagName))

  return {
    outputs: mapOutputDefinitions('output', outputNames, output, tag),
    tags: mapDefinitions('tag', tagNames, tag),
  }
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

function selectBrowserOutputs (outputNames, tagNames, definitions, browser) {
  if (browser.length < 1) return

  const {all} = definitions

  selectDefinitionOutputs(outputNames, tagNames, all)

  for (const target of selectBrowsers(browser, definitions)) {
    selectDefinitionOutputs(outputNames, tagNames, definitions[target])
  }
}

function selectBrowsers (browser, definitions) {
  const selected = new Set(
    browserslist(browser)
      .map(result => result.substring(0, result.indexOf(' ')))
  )

  return Array.from(selected).filter(name => definitions[name])
}

function selectOutputsForCategory (outputNames, tagNames, type, definitions, targets) {
  for (const target of targets) {
    const definition = definitions[target]

    if (!definition) throw new Error(`Unable to find definition for target.${type}.${target}`)

    selectDefinitionOutputs(outputNames, tagNames, definition)
  }
}

function selectDefinitionOutputs (outputNames, tagNames, definition) {
  const {outputs, tags} = definition

  for (const output of outputs) outputNames.add(output)
  for (const tag of tags) tagNames.add(tag)
}

function mapOutputDefinitions (type, names, output, tag) {
  const mapped = mapDefinitions(type, names, output)

  for (const name in mapped) {
    const definition = mapped[name]
    const {tags} = definition

    mapped[name] = {
      ...definition,

      tags: mapDefinitions('tag', tags, tag),
    }
  }

  return mapped
}

function mapDefinitions (type, names, definitions) {
  const mapped = {}

  for (const name of names) {
    const definition = definitions[name]

    if (!definition) throw new Error(`Unable to find definition for ${type}.${name}`)

    mapped[name] = definition
  }

  return mapped
}
