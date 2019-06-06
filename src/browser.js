const {Cluster} = require('puppeteer-cluster')

const {DEFAULT_BROWSER_CONCURRENCY, DEFAULT_BROWSER_TIMEOUT} = require('./constant.js')

module.exports = {
  createBrowserManager,
}

const launchOptions = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  pipe: true,
}

function createBrowserManager (env, retryOperation) {
  const {BROWSER_CONCURRENCY: envConcurrency, BROWSER_TIMEOUT: envTimeout} = env

  const clusterOptions = {
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: envConcurrency ? parseInt(envConcurrency) : DEFAULT_BROWSER_CONCURRENCY,
    puppeteerOptions: launchOptions,
    timeout: envTimeout ? parseInt(envTimeout) : DEFAULT_BROWSER_TIMEOUT,
  }

  let cluster
  const manager = {run, withPage}

  return manager

  async function run (fn) {
    await initialize()
    let result

    try {
      result = await fn()
    } finally {
      await destroy()
    }

    return result
  }

  function withPage (fn) {
    if (!cluster) throw new Error('Browser manager not started')

    return retryOperation(async function clusterExecute () { return cluster.execute(({page}) => fn(page)) })
  }

  async function initialize () {
    cluster = await Cluster.launch(clusterOptions)
  }

  async function destroy () {
    await cluster.idle()
    await cluster.close()
  }
}
