const puppeteer = require('puppeteer')

const {dipSize} = require('./size.js')
const {IMAGE_TYPE_PNG} = require('./constant.js')

module.exports = {
  launchBrowser,
  screenshot,
}

async function launchBrowser () {
  return puppeteer.launch()
}

async function screenshot (browser, url, size, options = {}) {
  const sizeViewport = viewport(size)

  const page = await browser.newPage()
  let image

  try {
    await page.setViewport(sizeViewport)
    await page.goto(url)

    image = await page.screenshot({
      encoding: 'binary',
      fullPage: false,
      omitBackground: true,
      type: IMAGE_TYPE_PNG,

      ...options,
    })
  } finally {
    await page.close()
  }

  return image
}

function viewport (size) {
  const {width, height} = dipSize(size)
  const {pixelRatio} = size

  return {
    width,
    height,
    deviceScaleFactor: pixelRatio,
  }
}
