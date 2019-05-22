module.exports = {
  all: {
    outputs: [
      'iconduit-manifest',
    ],
    tags: [],
  },
  browser: {
    all: {
      outputs: [
        'favicon-ico',
        'favicon-png',
        'index-html',
        'maskable-icon',
        'service-worker',
        'web-app-manifest',
      ],
      tags: [],
    },
    edge: {
      outputs: [
        'browserconfig-xml',
        'windows-tile',
        'windows-tile-small',
      ],
      tags: [],
    },
    ie: {
      outputs: [
        'browserconfig-xml',
        'windows-tile',
        'windows-tile-small',
      ],
      tags: [],
    },
    ios_saf: {
      outputs: [
        'safari-mask-icon',
      ],
      tags: [
        'apple-mobile',
      ],
    },
    safari: {
      outputs: [
        'safari-mask-icon',
      ],
      tags: [
        'apple-mobile',
      ],
    },
  },
  installer: {
    dmg: {
      outputs: [
        'dmg-background',
      ],
      tags: [],
    },
  },
  os: {
    ios: {
      outputs: [
        'apple-touch-icon',
        'apple-touch-startup',
      ],
      tags: [],
    },
    macos: {
      outputs: [
        'macos-icns',
      ],
      tags: [],
    },
    windows: {
      outputs: [
        'windows-ico',
      ],
      tags: [],
    },
  },
  web: {
    facebook: {
      outputs: [
        'facebook-app-icon',
        'open-graph-image',
      ],
      tags: [],
    },
    reddit: {
      outputs: [
        'open-graph-image',
      ],
      tags: [],
    },
    twitter: {
      outputs: [
        'twitter-card-image',
      ],
      tags: [],
    },
  },
}
