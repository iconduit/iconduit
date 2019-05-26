const {extname} = require('path')

module.exports = {
  mimeTypeByPath,
}

function mimeTypeByPath (path) {
  const extension = extname(path)

  switch (extension) {
    case '.gif':
      return 'image/gif'

    case '.html':
      return 'text/html'

    case '.icns':
      return 'image/icns'

    case '.ico':
      return 'image/vnd.microsoft.icon'

    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'

    case '.js':
      return 'text/javascript'

    case '.json':
      return 'application/json'

    case '.png':
      return 'image/png'

    case '.svg':
      return 'image/svg+xml'

    case '.webmanifest':
      return 'application/manifest+json'

    case '.xml':
      return 'application/xml'
  }

  throw new Error(`Unknown extension ${extension}`)
}
