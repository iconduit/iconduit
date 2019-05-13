const rmfr = require('rmfr')
const {join} = require('path')
const {promisify} = require('util')
const {tmpdir} = require('os')

module.exports = {
  promisifyFileSystem,
}

function promisifyFileSystem (fs) {
  const {mkdir, mkdtemp, readFile, writeFile} = fs

  const promisified = {
    mkdir: promisify(mkdir),
    mkdtemp: promisify(mkdtemp),
    readFile: promisify(readFile),
    rmfr: async filePath => rmfr(filePath, fs),
    writeFile: promisify(writeFile),
  }

  promisified['withTempDir'] = withTempDir.bind(null, promisified)

  return promisified
}

async function withTempDir (fs, fn) {
  const {mkdtemp} = fs
  const tempDirPath = await mkdtemp(join(tmpdir(), 'iconduit-'))
  let result

  try {
    result = await fn(tempDirPath)
  } finally {
    await fs.rmfr(tempDirPath)
  }

  return result
}
