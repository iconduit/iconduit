const {promisify} = require('util')

module.exports = {
  promisifyFileSystem,
}

function promisifyFileSystem (fs) {
  const {mkdir, readFile, writeFile} = fs

  return {
    mkdir: promisify(mkdir),
    readFile: promisify(readFile),
    writeFile: promisify(writeFile),
  }
}
