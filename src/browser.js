import puppeteer from "puppeteer";

import {
  DEFAULT_BROWSER_CONCURRENCY,
  DEFAULT_BROWSER_TIMEOUT,
} from "./constant.js";

export function createBrowserManager(env, logger, retryOperation) {
  const { BROWSER_CONCURRENCY: envConcurrency, BROWSER_TIMEOUT: envTimeout } =
    env;
  const concurrency = envConcurrency
    ? parseInt(envConcurrency, 10)
    : DEFAULT_BROWSER_CONCURRENCY;
  const timeout = envTimeout
    ? parseInt(envTimeout, 10)
    : DEFAULT_BROWSER_TIMEOUT;
  const subscribers = new Set();
  let available, browser, pages;

  const puppeteerOptions = {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
    ],
    timeout,
  };

  return {
    async run(fn) {
      if (browser) throw new Error("Browser manager already started");

      logger.debug(`Launching browser with ${concurrency} pages`);
      browser = await puppeteer.launch(puppeteerOptions);

      pages = await Promise.all(
        Array.from(Array(concurrency)).map(async () => {
          const page = await browser.newPage();
          page.setDefaultTimeout(timeout);

          return page;
        })
      );

      available = new Set(pages);
      let result;

      try {
        result = await fn();
      } finally {
        await Promise.all(pages.map((page) => page.close()));
        await browser.close();

        browser = undefined;
        pages = undefined;
      }

      return result;
    },

    async withPage(fn) {
      if (!browser) throw new Error("Browser manager not started");

      const page = await acquirePage();
      let result;

      try {
        result = await retryOperation(() => fn(page));
      } finally {
        releasePage(page);
      }

      return result;
    },
  };

  async function acquirePage() {
    logger.debug("Attempting to acquire a browser page");

    while (true) {
      // eslint-disable-next-line no-unreachable-loop
      for (const page of available) {
        logger.debug(`Browser page ${pageNumber(page)} acquired`);
        available.delete(page);

        return page;
      }

      await nextPage();
    }
  }

  function nextPage() {
    let res;
    const promise = new Promise((resolve) => {
      res = resolve;
    });

    function subscriber() {
      subscribers.delete(subscriber);
      res();
    }

    subscribers.add(subscriber);

    return promise;
  }

  function pageNumber(page) {
    return pages.indexOf(page) + 1;
  }

  function releasePage(page) {
    logger.debug(`Releasing browser page ${pageNumber(page)}`);

    available.add(page);
    subscribers.forEach((subscriber) => {
      subscriber();
    });
  }
}
