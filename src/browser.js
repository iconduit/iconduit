import {Cluster} from 'puppeteer-cluster'

import {DEFAULT_BROWSER_CONCURRENCY, DEFAULT_BROWSER_TIMEOUT} from './constant.js'

export function createBrowserManager (env, logger, retryOperation) {
  const {BROWSER_CONCURRENCY: envConcurrency, BROWSER_TIMEOUT: envTimeout} = env

  const puppeteerOptions = {
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--disable-web-security'],
  }

  const clusterOptions = {
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: envConcurrency ? parseInt(envConcurrency) : DEFAULT_BROWSER_CONCURRENCY,
    puppeteerOptions,
    timeout: envTimeout ? parseInt(envTimeout) : DEFAULT_BROWSER_TIMEOUT,
  }

  logger.debug(`Concurrency is currently set to ${clusterOptions.maxConcurrency}`)

  let cluster = null
  const manager = {run, withPage}

  return manager

  async function run (fn) {
    if (cluster) throw new Error('Browser manager already started')

    cluster = await Cluster.launch(clusterOptions)
    let result

    try {
      result = await fn()
    } finally {
      await cluster.idle()
      await cluster.close()

      cluster = null
    }

    return result
  }

  function withPage (fn) {
    if (!cluster) throw new Error('Browser manager not started')

    return retryOperation(async function clusterExecute () { return cluster.execute(({page}) => fn(page)) })
  }
}
