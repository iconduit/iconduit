const fs = require('fs')
const globby = require('globby')
const rmfr = require('rmfr')
const {join} = require('path')
const {promisify} = require('util')
const {tmpdir} = require('os')

module.exports = {
  createFileSystem,
}

function createFileSystem (env, logger) {
  const access = promisify(fs.access)
  const mkdir = promisify(fs.mkdir)
  const mkdtemp = promisify(fs.mkdtemp)
  const readFile = promisify(fs.readFile)
  const writeFile = promisify(fs.writeFile)

  return {
    access,
    globby,
    mkdir,
    mkdtemp,
    readFile,
    rmfr,
    withTempDir: withTempDir.bind(null, env, logger, mkdtemp),
    writeFile,
  }
}

async function withTempDir (env, logger, mkdtemp, fn) {
  const {KEEP_TEMP_DIRS = ''} = env
  const tempPath = await mkdtemp(join(tmpdir(), 'iconduit-'))
  let result

  try {
    result = await fn(tempPath)
  } finally {
    if (KEEP_TEMP_DIRS) {
      logger.debug(`Keeping temporary directory ${tempPath}`)
    } else {
      await rmfr(tempPath)
    }
  }

  return result
}
