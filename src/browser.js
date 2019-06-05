const puppeteer = require('puppeteer')

const {DEFAULT_BROWSER_TIMEOUT} = require('./constant.js')

module.exports = {
  createBrowserManager,
}

function createBrowserManager (env) {
  const {BROWSER_TIMEOUT: envTimeout} = env

  let browser, options
  const launchOptions = {args: ['--no-sandbox', '--disable-setuid-sandbox']}
  const manager = {run, withPage}

  return manager

  async function run (fn, opt = {}) {
    const {
      timeout,
    } = opt

    options = {
      timeout: chooseTimeout(timeout, envTimeout),
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

  function chooseTimeout (...timeouts) {
    for (const timeout of timeouts) {
      const type = typeof timeout

      if (type === 'number') return timeout
      if (type === 'string' && timeout) return parseInt(timeout)
    }

    return DEFAULT_BROWSER_TIMEOUT
  }

  async function initialize () {
    browser = await puppeteer.launch(launchOptions)
  }

  async function destroy () {
    await browser.close()
  }
}
