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
      await retryOperation(async function pageSetViewport () { return page.setViewport(sizeViewport) })
      await retryOperation(async function pageGoto () { return page.goto(url) })

      return retryOperation(async function pageScreenshot () {
        return page.screenshot({encoding: 'binary', fullPage: false, omitBackground: true, type})
      })
    })
  }
}

function viewport (size) {
  const {width, height} = dipSize(size)
  const {pixelRatio} = size

  return {width, height, deviceScaleFactor: pixelRatio}
}
