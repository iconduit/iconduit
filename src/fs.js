import fs from 'fs'
import rmfr from 'rmfr'
import {join} from 'path'
import {promisify} from 'util'
import {tmpdir} from 'os'

export function createFileSystem (env, logger) {
  const access = promisify(fs.access)
  const mkdir = promisify(fs.mkdir)
  const mkdtemp = promisify(fs.mkdtemp)
  const readFile = promisify(fs.readFile)
  const writeFile = promisify(fs.writeFile)

  return {
    access,
    mkdir,
    mkdtemp,
    readFile,
    rmfr,
    withTempDir,
    writeFile,
  }

  async function withTempDir (fn) {
    const {KEEP_TEMP_DIRS = ''} = env
    const tempPath = await mkdtemp(join(tmpdir(), 'iconduit-'))
    let result

    try {
      result = await fn(tempPath)
    } finally {
      if (KEEP_TEMP_DIRS) {
        logger.warn(`Keeping temporary directory ${tempPath}`)
      } else {
        await rmfr(tempPath)
      }
    }

    return result
  }
}
