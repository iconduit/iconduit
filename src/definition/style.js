const fraction = require('fraction.js')

module.exports = {
  appleTouchIconScale: {
    // the difference between the Android mask size (72/108)
    // and an exact 1/1 size
    transform: cssScaleFraction(fraction(1).div(72, 108)),
  },
  macosIconScale: {
    // the difference between the Android mask size (72/108)
    // and approximate Apple icon grid large circle size (892/1024)
    transform: cssScaleFraction(fraction(892, 1024).div(72, 108)),
  },
  noPaddingIconScale: {
    // the difference between the Android mask size (72/108)
    // and an exact 1/1 size
    transform: cssScaleFraction(fraction(1).div(72, 108)),
  },
  notificationBadgeScale: {
    // the difference between the Android safe zone (66/108)
    // and an exact 1/1 size
    transform: cssScaleFraction(fraction(1).div(66, 108)),
  },
  opacity1Third: {opacity: cssFraction(fraction(1, 3))},
  opacity10Percent: {opacity: '.1'},
  opacity2Thirds: {opacity: cssFraction(fraction(2, 3))},
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
  safariMaskIconScale: {
    // found empirically by testing under Safari on a touch bar MacBook Pro
    transform: cssScaleFraction(fraction(19, 10)),
  },
  webAppIconMaskableScale: {
    // the difference between the Android safe zone (66/108)
    // and the W3C web app manifest safe zone (4/5)
    // see https://w3c.github.io/manifest/#icon-masks
    transform: cssScaleFraction(fraction(4, 5).div(66, 108)),
  },
  webAppIconMaskedScale: {
    // found empirically by comparing against native icons on Android and macOS when installed as a PWA via Chrome
    transform: cssScaleFraction(fraction(7, 5)),
  },
  windowsTileIconScale: {
    // the difference between the Android safe zone (66/108)
    // and an exact 1/2 size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: cssScaleFraction(fraction(1, 2).div(66, 108)),
  },
  windowsTileIconSmallScale: {
    // the difference between the Android safe zone (66/108)
    // and an exact 2/3 size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: cssScaleFraction(fraction(2, 3).div(66, 108)),
  },
}

function cssScaleFraction (value) {
  return `scale(${cssFraction(value)})`
}

function cssFraction (value) {
  return `calc(${value.toFraction()})`
}
