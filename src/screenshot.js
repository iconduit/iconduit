import {IMAGE_TYPE_PNG} from './constant.js'
import {dipSize} from './size.js'

export function createScreenshotFactory (withBrowserPage) {
  return async function screenshot (url, size, options = {}) {
    const {type = IMAGE_TYPE_PNG} = options
    const sizeViewport = viewport(size)

    return withBrowserPage(async page => {
      await page.setViewport(sizeViewport)
      await page.goto(url)

      return page.screenshot({encoding: 'binary', fullPage: false, omitBackground: true, type})
    })
  }
}

function viewport (size) {
  const {width, height} = dipSize(size)
  const {pixelRatio} = size

  return {width, height, deviceScaleFactor: pixelRatio}
}
