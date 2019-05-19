module.exports = {
  browser: {
    all: {
      outputs: [
        'favicon-ico',
        'favicon-png',
        'index-html',
        'manifest-json',
        'maskable-icon',
        'service-worker',
      ],
    },
    edge: {
      outputs: [
        'browserconfig-xml',
        'windows-tile',
        'windows-tile-small',
      ],
    },
    ie: {
      outputs: [
        'browserconfig-xml',
        'windows-tile',
        'windows-tile-small',
      ],
    },
    ios_saf: {
      outputs: [
        'safari-mask-icon',
      ],
    },
    safari: {
      outputs: [
        'safari-mask-icon',
      ],
    },
  },
  installer: {
    dmg: {
      outputs: [
        'dmg-background',
      ],
    },
  },
  os: {
    ios: {
      outputs: [
        'apple-touch-icon',
        'apple-touch-startup',
      ],
    },
    macos: {
      outputs: [
        'macos-icns',
      ],
    },
    windows: {
      outputs: [
        'windows-ico',
      ],
    },
  },
  web: {
    facebook: {
      outputs: [
        'facebook-app-icon',
        'open-graph-image',
      ],
    },
    reddit: {
      outputs: [
        'open-graph-image',
      ],
    },
    twitter: {
      outputs: [
        'twitter-card-image',
      ],
    },
  },
}
