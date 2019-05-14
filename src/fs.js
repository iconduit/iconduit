const fs = require('fs')
const globby = require('globby')
const rmfr = require('rmfr')
const {join} = require('path')
const {promisify} = require('util')
const {tmpdir} = require('os')

const access = promisify(fs.access)
const mkdir = promisify(fs.mkdir)
const mkdtemp = promisify(fs.mkdtemp)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const fileSystem = {
  access,
  globby,
  mkdir,
  mkdtemp,
  readFile,
  rmfr,
  withTempDir,
  writeFile,
}

module.exports = {
  fileSystem,
}

async function withTempDir (fn) {
  const tempDirPath = await mkdtemp(join(tmpdir(), 'iconduit-'))
  let result

  try {
    result = await fn(tempDirPath)
  } finally {
    await rmfr(tempDirPath)
  }

  return result
}
