const puppeteer = require('puppeteer')

const {dipSize} = require('./size.js')

module.exports = {
  launchBrowser,
  viewport,
}

async function launchBrowser () {
  const browser = await puppeteer.launch()

  return browser
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
