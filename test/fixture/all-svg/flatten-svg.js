ready(() => {
  main().catch(error => {
    console.error(error)
  })
})

function createDefs (parent, svgDocuments) {
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

  for (const {documentElement} of svgDocuments) {
    defs.appendChild(documentElement)
  }

  parent.insertBefore(defs, parent.firstChild)
}

function findUses (svgDocument) {
  const local = []
  const external = []

  for (const use of svgDocument.getElementsByTagName('use')) {
    if (use.getAttribute('href').indexOf('#')) {
      external.push(use)
    } else {
      local.push(use)
    }
  }

  return [local, external]
}

async function fetchChild (documents, fetched, mapping, url) {
  if (fetched[url]) return

  const response = await fetch(url)
  const content = await response.text()
  const child = parseSvg(content)

  if (!child) return // failed to parse

  fetched[url] = child
  rewriteIds(mapping, url, child)
  documents.push([url, child])
}

async function main () {
  const documents = [[location.href, document]]
  const replacements = []
  const fetched = {}
  const mapping = {}

  // this loop avoids recursion
  while (documents.length > 0) {
    const [baseHref, svgDocument] = documents.pop()
    const [, uses] = findUses(svgDocument)
    const fetches = []

    for (const use of uses) {
      const url = new URL(use.getAttribute('href'), baseHref)

      replacements.push([url, use])
      fetches.push(fetchChild(documents, fetched, mapping, stripUrlHash(url)))
    }

    await Promise.all(fetches)
  }

  if (replacements.length < 1) return

  for (const [url, use] of replacements) {
    const mappedId = mapping[url]

    if (mappedId) use.setAttribute('href', `#${mappedId}`)
  }

  createDefs(document.documentElement, Object.values(fetched))
}

const domParser = new DOMParser()

function parseSvg (string) {
  const document = domParser.parseFromString(string, 'text/xml')
  const errors = document.getElementsByTagName('parsererror')

  if (errors.length) return undefined

  return document
}

function ready (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

const iriAttributes = [
  'clip-path',
  'color-profile',
  'cursor',
  'fill',
  'filter',
  'mask',
  'stroke',
  'style',
]

const idPattern = /#([^),{;\s]+)/g
let seq = 0

function rewriteIds (mapping, baseHref, svgDocument) {
  const localMapping = {}

  // rewrite IDs
  for (const element of svgDocument.querySelectorAll('[id]')) {
    const oldId = element.getAttribute('id')
    const oldHref = new URL(`#${oldId}`, baseHref)
    const newId = `__flat-${++seq}-${oldId}`

    element.setAttribute('id', newId)
    localMapping[oldId] = newId
    mapping[oldHref] = newId
  }

  // rewrite same-document use references
  for (const element of findUses(svgDocument)[0]) {
    const oldValue = element.getAttribute('href')
    const newValue = oldValue.replace(idPattern, (match, id) => `#${localMapping[id] || id}`)

    if (newValue !== oldValue) element.setAttribute('href', newValue)
  }

  // rewrite attribute references to replaced IDs
  for (const attribute of iriAttributes) {
    for (const element of svgDocument.querySelectorAll(`[${attribute}]`)) {
      const oldValue = element.getAttribute(attribute)
      const newValue = oldValue.replace(idPattern, (match, id) => `#${localMapping[id] || id}`)

      if (newValue !== oldValue) element.setAttribute(attribute, newValue)
    }
  }

  // rewrite style references to replaced IDs
  for (const element of svgDocument.getElementsByTagName('style')) {
    const oldValue = element.textContent
    const newValue = oldValue.replace(idPattern, (match, id) => `#${localMapping[id] || id}`)

    if (newValue !== oldValue) element.textContent = newValue
  }
}

function stripUrlHash (url) {
  const stripped = new URL(url)
  stripped.hash = ''

  return stripped
}
