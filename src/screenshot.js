const {IMAGE_TYPE_PNG} = require('./constant.js')

module.exports = {
  createScreenshotFactory,
}

function createScreenshotFactory (withBrowserPage) {
  return async function screenshot (url, size, options = {}) {
    const {type = IMAGE_TYPE_PNG} = options

    return withBrowserPage(size, async page => {
      await page.goto(url)

      return page.screenshot({omitBackground: true, type})
    })
  }
}
