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

function findReplaceableUses (svgDocument) {
  const uses = []

  for (const use of svgDocument.getElementsByTagName('use')) {
    const href = use.href.baseVal
    const hashPosition = href.indexOf('#')

    if (hashPosition) uses.push(use)
  }

  return uses
}

async function fetchChild (documents, fetched, mapping, url) {
  const documentUrl = new URL(url)
  documentUrl.hash = ''
  const documentUrlString = documentUrl.toString()

  if (fetched[documentUrlString]) return

  const response = await fetch(url)
  const content = await response.text()
  const child = parseSvg(content)

  if (child) {
    fetched[documentUrlString] = child
    rewriteIds(mapping, url, child)
    documents.push([url, child])
  }
}

async function flatten (baseHref, svgDocument) {
  const documents = [[baseHref, svgDocument]]
  const replacements = []
  const fetched = {}
  const mapping = {}

  while (documents.length > 0) {
    const [baseHref, svgDocument] = documents.pop()
    const uses = findReplaceableUses(svgDocument)
    const fetches = []

    for (const use of uses) {
      const href = use.getAttribute('href')
      const hrefUrl = new URL(href, baseHref)

      replacements.push([hrefUrl, use])
      fetches.push(fetchChild(documents, fetched, mapping, hrefUrl))
    }

    await Promise.all(fetches)
  }

  if (replacements.length < 1) return

  for (const [hrefUrl, use] of replacements) {
    const mappedId = mapping[hrefUrl.toString()]

    if (mappedId) use.setAttribute('href', `#${mappedId}`)
  }

  createDefs(svgDocument.documentElement, Object.values(fetched))
}

async function main () {
  await flatten(location.href, document)
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
    mapping[oldHref.toString()] = newId
  }

  // rewrite attribute references to replaced IDs
  for (const attribute of iriAttributes) {
    for (const element of svgDocument.querySelectorAll(`[${attribute}]`)) {
      const oldValue = element.getAttribute(attribute)
      const newValue = oldValue.replace(idPattern, (match, id) => `#${localMapping[id] || id}`)

      if (newValue != oldValue) element.setAttribute(attribute, newValue)
    }
  }

  // rewrite style references to replaced IDs
  for (const element of svgDocument.getElementsByTagName('style')) {
    const oldValue = element.textContent
    const newValue = oldValue.replace(idPattern, (match, id) => `#${localMapping[id] || id}`)

    if (newValue != oldValue) element.textContent = newValue
  }
}
