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

  // Some sizes use non-integer device-independent widths and heights, combined
  // with a pixel ratio multiplier. An example is iOS app icons' 83.5@2x size,
  // which comes out to 167@1x. Puppeteer can't handle viewports with
  // non-integer dimensions, so we have to collapse these down by applying the
  // pixel ratio before rendering.
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return {width: size.width, height: size.height}
  }

  return {width, height, deviceScaleFactor: pixelRatio}
}
