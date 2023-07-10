export const systemClock = {
  clearTimeout,
  now,
  setTimeout,
  withTimeout,
};

function now() {
  return Date.now();
}

function withTimeout(delay, fn) {
  const status = { isTimeout: false };
  let resolveTimeout;

  const timeout = new Promise((resolve, reject) => {
    function rejectTimeout() {
      status.isTimeout = true;

      const error = new Error(
        `Operation ${fn.name || "(anonymous)"} timed out`,
      );
      error.isTimeout = true;

      reject(error);
    }

    const timeoutId = systemClock.setTimeout(rejectTimeout, delay);

    resolveTimeout = () => {
      systemClock.clearTimeout(timeoutId);
      resolve();
    };
  });

  const operation = fn(status);
  // eslint-disable-next-line promise/catch-or-return
  operation.catch(() => {}).then(resolveTimeout);

  return Promise.race([timeout, operation]);
}
