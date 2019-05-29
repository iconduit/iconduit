const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminOptipng = require('imagemin-optipng')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const {buffer} = require('imagemin')

const {
  IMAGE_TYPE_ICO_PNG,
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_PNG,
  IMAGE_TYPE_SVG,
} = require('./constant.js')

module.exports = {
  createImageMinifier,
}

function createImageMinifier () {
  const icoPngOptions = {plugins: [imageminOptipng({colorTypeReduction: false})]}
  const lossyJpegOptions = {plugins: [imageminMozjpeg()]}
  const lossyPngOptions = {plugins: [imageminPngquant()]}
  const lossySvgOptions = {plugins: [imageminSvgo()]}

  return async function minifyImage (type, image) {
    switch (type) {
      case IMAGE_TYPE_ICO_PNG: return buffer(image, icoPngOptions)
      case IMAGE_TYPE_JPEG: return buffer(image, lossyJpegOptions)
      case IMAGE_TYPE_PNG: return buffer(image, lossyPngOptions)
      case IMAGE_TYPE_SVG: return buffer(image, lossySvgOptions)
    }

    return image
  }
}
