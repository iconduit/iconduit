module.exports = {
  'apple-touch-icon-scale': {
    transform: 'scale(1.8)',
  },
  'social-share-icon-scale': {
    transform: 'scale(.5)',
  },
  'windows-tile-icon-position': {
    // this is the difference between the standard Android square keyline size (44/108) and an exact 50% size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: 'scale(calc(27 / 22))',
  },
  'windows-tile-icon-position-small': {
    // this is the difference between the standard Android square keyline size (44/108) and an exact 66% size
    // see https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos#tile-padding-recommendations
    transform: 'scale(calc(81 / 50))',
  },
}
