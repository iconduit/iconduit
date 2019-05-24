const {get} = require('jsonpointer')

module.exports = {
  resolveIfReference,
  resolveReference,
}

function resolveIfReference (definitions, value) {
  if (typeof value === 'function') return value(definitions)
  if (isJsonReference(value)) return resolveJsonReference(definitions, value)

  return value
}

function resolveReference (definitions, reference) {
  if (typeof reference === 'function') return reference(definitions)

  return resolveJsonReference(definitions, reference)
}

function resolveJsonReference (definitions, reference) {
  const {$ref} = reference
  const [url, pointer] = $ref.split('#')

  if (!url || !pointer) throw new Error(`Invalid or unsupported reference ${JSON.stringify($ref)}`)
  if (!definitions.hasOwnProperty(url)) throw new Error(`Unable to resolve document for ${JSON.stringify($ref)}`)

  const value = get(definitions[url], pointer)

  if (typeof value === 'undefined') throw new Error(`Unable to resolve value for ${JSON.stringify($ref)}`)

  return value
}

function isJsonReference (value) {
  return value != null && typeof value === 'object' && typeof value.hasOwnProperty('$ref')
}
