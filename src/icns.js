const {format} = require('icns-lib')

const {buildFileName} = require('./size.js')

const {
  ICNS_512_2X,
  ICNS_512_1X,
  ICNS_256_2X,
  ICNS_256_1X,
  ICNS_128_2X,
  ICNS_128_1X,
  ICNS_64_1X,
  ICNS_32_2X,
  ICNS_32_1X,
  ICNS_16_2X,
  ICNS_16_1X,
} = require('./constant.js')

module.exports = {
  toIcns,
}

async function toIcns (logger, entries) {
  const entriesBySize = mapEntriesBySize(entries)
  const types = {}

  function addSize (type, dimension, pixelRatio, entriesBySize) {
    const content = entriesBySize[`${dimension}.${pixelRatio}`]

    if (content) {
      logger.debug(`Adding ICNS entry for ${dimension}@${pixelRatio}x`)
      types[type] = content
    } else {
      logger.debug(`No ICNS entry supplied for ${dimension}@${pixelRatio}x`)
    }
  }

  addSize(ICNS_512_2X, 512, 2, entriesBySize)
  addSize(ICNS_512_1X, 512, 1, entriesBySize)
  addSize(ICNS_256_2X, 256, 2, entriesBySize)
  addSize(ICNS_256_1X, 256, 1, entriesBySize)
  addSize(ICNS_128_2X, 128, 2, entriesBySize)
  addSize(ICNS_128_1X, 128, 1, entriesBySize)
  addSize(ICNS_64_1X, 64, 1, entriesBySize)
  addSize(ICNS_32_2X, 32, 2, entriesBySize)
  addSize(ICNS_32_1X, 32, 1, entriesBySize)
  addSize(ICNS_16_2X, 16, 2, entriesBySize)
  addSize(ICNS_16_1X, 16, 1, entriesBySize)

  return format(types)
}

function mapEntriesBySize (entries) {
  const entriesBySize = {}

  for (const {content, size} of entries) {
    entriesBySize[buildFileName('[dipWidth].[pixelRatio]', size)] = content
  }

  return entriesBySize
}
