const {firefox} = require('playwright-firefox')

const {createDeferred} = require('./async.js')
const {DEFAULT_BROWSER_CONCURRENCY, DEFAULT_BROWSER_TIMEOUT} = require('./constant.js')
const {dipSize} = require('./size.js')

module.exports = {
  createBrowserManager,
}

function createBrowserManager (env, logger, retryOperation) {
  const {BROWSER_CONCURRENCY: envConcurrency, BROWSER_TIMEOUT: envTimeout} = env
  const concurrency = envConcurrency ? parseInt(envConcurrency, 10) : DEFAULT_BROWSER_CONCURRENCY
  const timeout = envTimeout ? parseInt(envTimeout, 10) : DEFAULT_BROWSER_TIMEOUT
  const contexts = new Map()
  const queues = new Map()
  const workers = []
  let browser

  logger.debug(`Concurrency is currently set to ${concurrency}`)

  return {run, withPage}

  async function acquire (size) {
    const {pixelRatio = 1} = size

    logger.debug(`Acquiring browser page for @${pixelRatio}x`)

    if (!queues.has(pixelRatio)) {
      logger.silly(`Creating browser page queue for @${pixelRatio}x`)
      queues.set(pixelRatio, [])
    }

    const queue = queues.get(pixelRatio)

    const deferred = createDeferred()
    queue.push({deferred, size})

    await processQueues()

    return deferred.promise
  }

  function countQueuedJobs () {
    let total = 0
    queues.forEach(queue => { total += queue.length })

    return total
  }

  async function createPage (pixelRatio) {
    if (!contexts.has(pixelRatio)) {
      logger.silly(`Creating browser context for @${pixelRatio}x`)

      const contextPromise = browser.newContext({deviceScaleFactor: pixelRatio})
      contexts.set(pixelRatio, contextPromise)
    }

    const context = await contexts.get(pixelRatio)
    context.setDefaultTimeout(timeout)

    logger.silly(`Creating browser page for @${pixelRatio}x`)

    return context.newPage()
  }

  async function drain () {
    logger.silly('Draining browser page pool')

    await Promise.all(workers.map(({page}) => page.close()))
    await Promise.all(Array.from(contexts.values()).map(context => context.close()))
  }

  async function handleJob (worker, job) {
    const {page, pixelRatio} = worker
    const {deferred, size} = job

    logger.silly(`Assigning job to @${pixelRatio}x browser page`)

    worker.isIdle = false
    await page.setViewportSize(dipSize(size))
    deferred.resolve(page)
  }

  async function processQueues () {
    logger.silly(`Browser page pool has ${workers.length} worker(s), ${countQueuedJobs()} queued job(s)`)

    const idleWorkers = []

    // try to re-assign idle workers first
    for (const worker of workers) {
      if (!worker.isIdle) {
        logger.silly('Browser page is busy')

        continue
      }

      const {pixelRatio} = worker
      const queue = queues.get(pixelRatio)
      const job = queue.shift()

      if (!job) {
        logger.silly(`No jobs for idle @${pixelRatio}x browser page`)
        idleWorkers.push(worker)

        continue
      }

      await handleJob(worker, job)
    }

    // spin up new workers when allowed
    for (const [pixelRatio, queue] of queues) {
      while (workers.length < concurrency && queue.length > 0) {
        const worker = {isIdle: false, pixelRatio}
        workers.push(worker)
        worker.page = await createPage(pixelRatio)

        await handleJob(worker, queue.shift())
      }
    }

    // kill off idle workers with other pixel ratios
    while (idleWorkers.length > 0 && countQueuedJobs() > 0) {
      for (const [pixelRatio, queue] of queues) {
        const job = queue.shift()

        if (!job) {
          logger.silly(`No jobs in the @${pixelRatio}x queue`)

          continue
        }

        const worker = idleWorkers.shift()

        logger.silly(`Closing idle @${worker.pixelRatio}x browser page`)

        worker.isIdle = false
        await worker.page.close()
        const page = await createPage(pixelRatio)
        Object.assign(worker, {page, pixelRatio})

        await handleJob(worker, job)
      }
    }

    logger.silly(`Browser page pool has ${workers.length} page(s), ${countQueuedJobs()} queued job(s)`)
  }

  async function release (page) {
    for (const worker of workers) {
      if (worker.page === page) {
        logger.debug(`Releasing browser page for @${worker.pixelRatio}x`)

        worker.isIdle = true

        continue
      }
    }

    await processQueues()
  }

  async function run (fn) {
    if (browser) throw new Error('Browser manager already started')

    browser = await firefox.launch({timeout})

    try {
      return await fn()
    } finally {
      await drain()

      await browser.close()
      browser = undefined
    }
  }

  function withPage (sizeOrFn, fn) {
    if (!browser) throw new Error('Browser manager not started')

    let size

    if (fn) {
      size = sizeOrFn
    } else {
      size = {}
      fn = sizeOrFn
    }

    return retryOperation(async () => {
      const page = await acquire(size)

      try {
        return await fn(page)
      } finally {
        await release(page)
      }
    })
  }
}
