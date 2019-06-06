const {IMAGE_TYPE_PNG} = require('./constant.js')
const {dipSize} = require('./size.js')

module.exports = {
  createScreenshotFactory,
}

function createScreenshotFactory (retryOperation, withBrowserPage) {
  return async function screenshot (url, size, options = {}) {
    const {type = IMAGE_TYPE_PNG} = options
    const sizeViewport = viewport(size)

    return withBrowserPage(async page => {
      await retryOperation(page.setViewport.bind(page, sizeViewport))
      await retryOperation(page.goto.bind(page, url))

      return retryOperation(
        page.screenshot.bind(page, {encoding: 'binary', fullPage: false, omitBackground: true, type})
      )
    })
  }
}

function viewport (size) {
  const {width, height} = dipSize(size)
  const {pixelRatio} = size

  return {width, height, deviceScaleFactor: pixelRatio}
}
