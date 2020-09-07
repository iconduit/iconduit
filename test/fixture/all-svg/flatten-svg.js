ready(() => {
  main().catch(error => {
    console.error(error)
  })
})

async function flatten (baseHref, svgDocument) {
  const toReplace = []

  for (const useElement of svgDocument.getElementsByTagName('use')) {
    const href = useElement.href.baseVal
    const hashPosition = href.indexOf('#')

    if (hashPosition) toReplace.push(useElement)
  }

  if (toReplace.length < 1) return

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const {documentElement} = svgDocument
  documentElement.insertBefore(defs, documentElement.firstChild)

  for (const useElement of toReplace) {
    const href = useElement.getAttribute('href')
    const url = new URL(href, baseHref)
    const hrefId = url.hash.substring(1)

    const response = await fetch(href)
    const content = await response.text()
    let child

    try {
      child = parseSvg(content)
    } catch (error) {
      console.error(error)

      continue
    }

    const mapping = rewriteIds(child)
    const mappedId = mapping[hrefId]

    if (!mappedId) continue

    flatten(url, child)
    defs.appendChild(child.documentElement)
    useElement.setAttribute('href', `#${mappedId}`)
  }
}

async function main () {
  await flatten(location.href, document)
}

const domParser = new DOMParser()

function parseSvg (string) {
  const document = domParser.parseFromString(string, 'text/xml')
  const errors = document.getElementsByTagName('parsererror')

  if (errors.length) throw new Error('Unable to parse SVG')

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

function rewriteIds (element) {
  const mapping = {}

  // rewrite IDs
  for (const idElement of element.querySelectorAll('[id]')) {
    const oldId = idElement.getAttribute('id')
    const newId = `__flat-${++seq}-${oldId}`

    idElement.setAttribute('id', newId)
    mapping[oldId] = newId
  }

  // rewrite attribute references to replaced IDs
  for (const attribute of iriAttributes) {
    for (const iriElement of element.querySelectorAll(`[${attribute}]`)) {
      const oldValue = iriElement.getAttribute(attribute)
      const newValue = oldValue.replace(idPattern, (match, id) => `#${mapping[id] || id}`)

      if (newValue != oldValue) iriElement.setAttribute(attribute, newValue)
    }
  }

  // rewrite style references to replaced IDs
  for (const styleElement of element.getElementsByTagName('style')) {
    const oldValue = styleElement.textContent
    const newValue = oldValue.replace(idPattern, (match, id) => `#${mapping[id] || id}`)

    if (newValue != oldValue) styleElement.textContent = newValue
  }

  return mapping
}
