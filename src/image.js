import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminOptipng from 'imagemin-optipng'
import imageminPngquant from 'imagemin-pngquant'
import {buffer} from 'imagemin'

import {
  IMAGE_TYPE_ICO_PNG,
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_PNG,
} from './constant.js'

export function createImageMinifier () {
  const icoPngOptions = {plugins: [imageminOptipng({colorTypeReduction: false})]}
  const lossyJpegOptions = {plugins: [imageminMozjpeg()]}
  const lossyPngOptions = {plugins: [imageminPngquant()]}

  return async function minifyImage (type, image) {
    switch (type) {
      case IMAGE_TYPE_ICO_PNG: return buffer(image, icoPngOptions)
      case IMAGE_TYPE_JPEG: return buffer(image, lossyJpegOptions)
      case IMAGE_TYPE_PNG: return buffer(image, lossyPngOptions)
    }

    return image
  }
}
