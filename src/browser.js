const puppeteer = require('puppeteer')

const {DEFAULT_BROWSER_TIMEOUT} = require('./constant.js')

module.exports = {
  createBrowserManager,
}

const launchOptions = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  pipe: true,
}

function createBrowserManager (env, retryOperation) {
  const {BROWSER_TIMEOUT: envTimeout} = env
  const timeout = envTimeout ? parseInt(envTimeout) : DEFAULT_BROWSER_TIMEOUT

  let browser
  const manager = {run, withPage}

  return manager

  async function run (fn) {
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

    const page = await retryOperation(browser.newPage.bind(browser))
    let result

    try {
      page.setDefaultTimeout(timeout)
      result = await fn(page)
    } finally {
      await retryOperation(page.close.bind(page))
    }

    return result
  }

  async function initialize () {
    browser = await retryOperation(puppeteer.launch.bind(puppeteer, launchOptions))
  }

  async function destroy () {
    await retryOperation(browser.close.bind(browser))
  }
}
