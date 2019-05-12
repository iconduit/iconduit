module.exports = {
  browser: {
    all: {
      outputs: [
        'favicon-ico',
        'favicon-png',
        'html',
        'manifest-json',
        'maskable-icon',
        'service-worker',
      ],
    },
    edge: {
      outputs: [
        'browserconfig-xml',
        'windows-tile',
      ],
    },
    ie: {
      outputs: [
        'browserconfig-xml',
        'windows-tile',
      ],
    },
    ios: {
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
