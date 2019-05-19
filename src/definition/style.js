module.exports = {
  'apple-touch-icon-scale': {
    // the difference between the Android large circle keyline diameter (52/108)
    // and approximate iOS icon grid large circle size (892/1024)
    // see https://itunes.apple.com/us/book/icon-design/id873778893
    transform: 'scale(calc(6021 / 3328))',
  },
  'windows-tile-icon-position': {
    // the difference between the Android square keyline size (44/108) and an exact 50% size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: 'scale(calc(27 / 22))',
  },
  'windows-tile-icon-position-small': {
    // the difference between the Android square keyline size (44/108) and an exact 66% size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: 'scale(calc(81 / 50))',
  },
}
