const puppeteer = require('puppeteer')

const {DEFAULT_PUPPETEER_TIMEOUT} = require('./constant.js')

module.exports = {
  createBrowserManager,
}

function createBrowserManager () {
  let browser, options
  const manager = {run, withPage}

  return manager

  async function run (fn, opt = {}) {
    const {
      timeout = DEFAULT_PUPPETEER_TIMEOUT,
    } = opt

    options = {
      timeout,
    }

    await initialize()
    let result

    try {
      result = await fn(browser)
    } finally {
      await destroy()
    }

    return result
  }

  async function withPage (fn) {
    if (!browser) throw new Error('Browser manager not started')

    const page = await browser.newPage()
    let result

    try {
      page.setDefaultTimeout(options.timeout)
      result = await fn(page)
    } finally {
      await page.close()
    }

    return result
  }

  async function initialize () {
    browser = await puppeteer.launch()
  }

  async function destroy () {
    await browser.close()
  }
}
