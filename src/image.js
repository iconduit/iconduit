import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminOptipng from "imagemin-optipng";
import imageminPngquant from "imagemin-pngquant";

import {
  IMAGE_TYPE_ICO_PNG,
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_PNG,
} from "./constant.js";

const { buffer } = imagemin;

export function createImageMinifier() {
  const icoPngOptions = {
    plugins: [imageminOptipng({ colorTypeReduction: false })],
  };
  const lossyJpegOptions = { plugins: [imageminMozjpeg()] };
  const lossyPngOptions = { plugins: [imageminPngquant()] };

  return async function minifyImage(type, image) {
    switch (type) {
      case IMAGE_TYPE_ICO_PNG:
        return Buffer.from(await buffer(image, icoPngOptions));
      case IMAGE_TYPE_JPEG:
        return Buffer.from(await buffer(image, lossyJpegOptions));
      case IMAGE_TYPE_PNG:
        return Buffer.from(await buffer(image, lossyPngOptions));
    }

    return image;
  };
}
