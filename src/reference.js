const {get} = require('jsonpointer')

module.exports = {
  resolveIfReference,
  resolveReference,
}

function resolveIfReference (definitions, reference) {
  if (typeof reference !== 'object' || reference === null) return reference

  return resolveReference(definitions, reference)
}

function resolveReference (definitions, reference) {
  const {$ref} = reference
  const [url, pointer] = $ref.split('#')

  if (!url || !pointer) throw new Error(`Invalid or unsupported reference ${JSON.stringify($ref)}`)
  if (!definitions.hasOwnProperty(url)) throw new Error(`Unable to resolve document for ${JSON.stringify($ref)}`)

  const value = get(definitions[url], pointer)

  if (typeof value === 'undefined') throw new Error(`Unable to resolve value for ${JSON.stringify($ref)}`)

  return value
}
