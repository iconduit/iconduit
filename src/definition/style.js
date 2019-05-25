module.exports = {
  appleTouchIconScale: {
    // the difference between the Android large circle keyline diameter (52/108)
    // and approximate Apple icon grid large circle size (892/1024)
    transform: 'scale(calc(6021 / 3328))',
  },
  macosIconScale: {
    // the difference between the Android circle mask diameter (72/108)
    // and approximate Apple icon grid large circle size (892/1024)
    transform: 'scale(calc(669 / 512))',
  },
  maskedIconMinimalPaddingScale: {
    // the difference between the Android circle mask diameter (72/108)
    // and an exact 100% size
    transform: 'scale(1.5)',
  },
  opacity1Third: {opacity: 'calc(1 / 3)'},
  opacity10Percent: {opacity: '.1'},
  opacity2Thirds: {opacity: 'calc(2 / 3)'},
  opacity20Percent: {opacity: '.2'},
  opacity25Percent: {opacity: '.25'},
  opacity30Percent: {opacity: '.3'},
  opacity40Percent: {opacity: '.4'},
  opacity50Percent: {opacity: '.5'},
  opacity60Percent: {opacity: '.6'},
  opacity70Percent: {opacity: '.7'},
  opacity75Percent: {opacity: '.75'},
  opacity80Percent: {opacity: '.8'},
  opacity90Percent: {opacity: '.9'},
  webAppMaskableIconScale: {
    // the difference between the Android safe zone diameter (66/108)
    // and the W3C web app manifest safe zone diameter (4/5)
    // see https://w3c.github.io/manifest/#icon-masks
    transform: 'scale(calc(72 / 55))',
  },
  webAppMaskedIconScale: {
    // found empirically by comparing against native icons on Android and macOS when installed as a PWA via Chrome
    transform: 'scale(1.345)',
  },
  windowsTileIconScale: {
    // the difference between the Android square keyline size (44/108)
    // and an exact 50% size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: 'scale(calc(27 / 22))',
  },
  windowsTileIconScaleSmall: {
    // the difference between the Android square keyline size (44/108)
    // and an exact 66% size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: 'scale(calc(81 / 50))',
  },
}
