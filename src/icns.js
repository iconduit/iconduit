const {encode} = require('@fiahfy/packbits')
const {format} = require('icns-lib')
const {PNG} = require('pngjs')

const {renderSize} = require('./size.js')

const {
  ICNS_512_2X,
  ICNS_512_1X,
  ICNS_256_2X,
  ICNS_256_1X,
  ICNS_128_2X,
  ICNS_128_1X,
  ICNS_32_2X,
  ICNS_32_1X,
  ICNS_32_1X_MASK,
  ICNS_16_2X,
  ICNS_16_1X,
  ICNS_16_1X_MASK,
} = require('./constant.js')

module.exports = {
  toIcns,
}

async function toIcns (logger, entries) {
  const entriesBySize = mapEntriesBySize(entries)
  const types = {}

  function addPng (type, dimension, pixelRatio, entriesBySize) {
    const content = entriesBySize[`${dimension}.${pixelRatio}`]
    if (!content) return logger.debug(`No ICNS entry supplied for ${dimension}@${pixelRatio}x`)

    logger.debug(`Adding ICNS PNG entry for ${dimension}@${pixelRatio}x`)
    types[type] = content
  }

  function addIcon (iconType, maskType, dimension, pixelRatio, entriesBySize) {
    const content = entriesBySize[`${dimension}.${pixelRatio}`]

    if (!content) return logger.debug(`No ICNS entry supplied for ${dimension}@${pixelRatio}x`)

    const png = PNG.sync.read(content)

    logger.debug(`Adding ICNS RGB entry for ${dimension}@${pixelRatio}x`)
    types[iconType] = pngToRgb(png)

    logger.debug(`Adding ICNS mask entry for ${dimension}@${pixelRatio}x`)
    types[maskType] = pngToMask(png)
  }

  addPng(ICNS_512_2X, 512, 2, entriesBySize)
  addPng(ICNS_512_1X, 512, 1, entriesBySize)
  addPng(ICNS_256_2X, 256, 2, entriesBySize)
  addPng(ICNS_256_1X, 256, 1, entriesBySize)
  addPng(ICNS_128_2X, 128, 2, entriesBySize)
  addPng(ICNS_128_1X, 128, 1, entriesBySize)
  addPng(ICNS_32_2X, 32, 2, entriesBySize)
  addIcon(ICNS_32_1X, ICNS_32_1X_MASK, 32, 1, entriesBySize)
  addPng(ICNS_16_2X, 16, 2, entriesBySize)
  addIcon(ICNS_16_1X, ICNS_16_1X_MASK, 16, 1, entriesBySize)

  return format(types)
}

function mapEntriesBySize (entries) {
  const entriesBySize = {}

  for (const {content, size} of entries) {
    entriesBySize[renderSize('[dipWidth].[pixelRatio]', size)] = content
  }

  return entriesBySize
}

function pngToRgb (png) {
  const channelSize = png.width * png.height
  const red = Buffer.alloc(channelSize)
  const green = Buffer.alloc(channelSize)
  const blue = Buffer.alloc(channelSize)

  for (let i = 0; i < channelSize; ++i) {
    const redOffset = i * 4
    const greenOffset = redOffset + 1
    const blueOffset = greenOffset + 1

    png.data.copy(red, i, redOffset, redOffset + 1)
    png.data.copy(green, i, greenOffset, greenOffset + 1)
    png.data.copy(blue, i, blueOffset, blueOffset + 1)
  }

  return Buffer.concat([
    encode(red, {format: 'icns'}),
    encode(green, {format: 'icns'}),
    encode(blue, {format: 'icns'}),
  ])
}

function pngToMask (png) {
  const channelSize = png.width * png.height
  const alpha = Buffer.alloc(channelSize)

  for (let i = 0; i < channelSize; ++i) {
    const offset = i * 4 + 3

    png.data.copy(alpha, i, offset, offset + 1)
  }

  return alpha
}
