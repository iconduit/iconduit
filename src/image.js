const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const {buffer} = require('imagemin')

const {IMAGE_TYPE_PNG, IMAGE_TYPE_SVG} = require('./constant.js')

module.exports = {
  createImageMinifier,
}

function createImageMinifier () {
  const pngOptions = {
    plugins: [imageminPngquant()],
  }
  const svgOptions = {
    plugins: [imageminSvgo()],
  }

  return async function minifyImage (type, image) {
    switch (type) {
      case IMAGE_TYPE_PNG: return buffer(image, pngOptions)
      case IMAGE_TYPE_SVG: return buffer(image, svgOptions)
    }

    return image
  }
}
