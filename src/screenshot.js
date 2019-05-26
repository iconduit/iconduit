const puppeteer = require('puppeteer')

const {dipSize} = require('./size.js')
const {IMAGE_TYPE_PNG} = require('./constant.js')

module.exports = {
  createScreenshotManager,
}

function createScreenshotManager () {
  const manager = {run, screenshot}
  let browser

  return manager

  async function run (fn) {
    await initialize()
    let result

    try {
      result = await fn(manager)
    } finally {
      await destroy()
    }

    return result
  }

  async function screenshot (url, size, options = {}) {
    const sizeViewport = viewport(size)
    const page = await browser.newPage()
    let image

    try {
      await page.setViewport(sizeViewport)
      await page.goto(url, {timeout: 0})

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

  async function initialize () {
    browser = await puppeteer.launch()
  }

  async function destroy () {
    await browser.close()
  }
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
