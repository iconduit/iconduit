const rmfr = require('rmfr')
const {promisify} = require('util')

module.exports = {
  promisifyFileSystem,
}

function promisifyFileSystem (fs) {
  const {mkdir, readFile, writeFile} = fs

  return {
    mkdir: promisify(mkdir),
    readFile: promisify(readFile),
    rmfr: async filePath => rmfr(filePath, fs),
    writeFile: promisify(writeFile),
  }
}
