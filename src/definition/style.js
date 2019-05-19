module.exports = {
  'apple-touch-icon-scale': {
    // the difference between the Android large circle keyline diameter (52/108)
    // and approximate iOS icon grid large circle size (892/1024)
    // see https://itunes.apple.com/us/book/icon-design/id873778893
    transform: 'scale(calc(6021 / 3328))',
  },
  'opacity-1-third': {opacity: 'calc(1 / 3)'},
  'opacity-10-percent': {opacity: '.1'},
  'opacity-2-thirds': {opacity: 'calc(2 / 3)'},
  'opacity-20-percent': {opacity: '.2'},
  'opacity-25-percent': {opacity: '.25'},
  'opacity-30-percent': {opacity: '.3'},
  'opacity-40-percent': {opacity: '.4'},
  'opacity-50-percent': {opacity: '.5'},
  'opacity-60-percent': {opacity: '.6'},
  'opacity-70-percent': {opacity: '.7'},
  'opacity-75-percent': {opacity: '.75'},
  'opacity-80-percent': {opacity: '.8'},
  'opacity-90-percent': {opacity: '.9'},
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
