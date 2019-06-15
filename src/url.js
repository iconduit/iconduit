const urlParse = require('url-parse')
const {dirname, join, normalize, relative} = require('path')

module.exports = {
  isAbsolute,
  relativeUrl,
  resolveUrl,
}

function isAbsolute (url) {
  const parsed = urlParse(url)

  return !!parsed.host
}

function relativeUrl (fromUrl, toUrl) {
  const fromUrlParsed = urlParse(fromUrl)
  const toUrlParsed = urlParse(toUrl)

  if (fromUrlParsed.origin !== toUrlParsed.origin) return toUrl

  const fromUrlIsAbsolute = !!fromUrlParsed.host
  const toUrlIsAbsolute = !!toUrlParsed.host

  toUrlParsed.protocol = ''
  toUrlParsed.slashes = false
  toUrlParsed.auth = ''
  toUrlParsed.host = ''
  toUrlParsed.port = ''

  const fromPathname = normalize(
    fromUrlIsAbsolute
      ? fromUrlParsed.pathname.startsWith('/') ? fromUrlParsed.pathname : '/' + fromUrlParsed.pathname
      : fromUrlParsed.pathname
  )
  const toPathname = normalize(
    toUrlIsAbsolute
      ? toUrlParsed.pathname.startsWith('/') ? toUrlParsed.pathname : '/' + toUrlParsed.pathname
      : toUrlParsed.pathname
  )

  const fromUrlPathnameIsAbsolute = fromPathname.startsWith('/')
  const toUrlPathnameIsAbsolute = toPathname.startsWith('/')

  if (fromUrlPathnameIsAbsolute && !toUrlPathnameIsAbsolute) return toUrlParsed.toString()

  const fromPathnameIsDir = fromPathname.endsWith('/')
  const fromDirPathname = fromPathnameIsDir ? fromPathname : dirname(fromPathname)

  const toPathnameIsDir = toPathname.endsWith('/')
  const trailingSlash = isFilePathname(toPathname) ? '' : '/'

  const relativePath = fromPathnameIsDir && !toPathnameIsDir
    ? relative(fromDirPathname, toPathname)
    : relative(fromDirPathname, toPathname) || '.'

  toUrlParsed.pathname = isFilePathname(relativePath) ? relativePath + trailingSlash : relativePath

  return toUrlParsed.toString()
}

function resolveUrl (baseUrl, url) {
  const baseUrlParsed = urlParse(baseUrl)

  if (baseUrlParsed.host) return urlParse(url, baseUrl).toString()

  const urlParsed = urlParse(url)
  urlParsed.pathname = resolvePathname(baseUrlParsed.pathname, urlParsed.pathname)

  return urlParsed.toString()
}

function resolvePathname (basePathname, pathname) {
  if (!pathname) return normalize(basePathname)

  const normalized = normalize(pathname)

  if (pathname.startsWith('/')) return normalized

  const baseDirPathname = basePathname.endsWith('/') ? basePathname : dirname(basePathname)
  const trailingSlash = isFilePathname(normalized) ? '' : '/'
  const resolved = normalize(join(baseDirPathname, normalized))

  return isFilePathname(resolved) ? resolved + trailingSlash : resolved
}

function isFilePathname (pathname) {
  if (pathname === '.' || pathname.endsWith('/')) return false

  const lastSlashIndex = pathname.lastIndexOf('/')
  let lastAtom

  if (lastSlashIndex < 0) {
    lastAtom = pathname
  } else {
    lastAtom = pathname.substring(lastSlashIndex + 1)
  }

  return lastAtom !== '..'
}
