module.exports = {
  all: {
    outputs: [
      'iconduitManifest',
    ],
    tags: [],
  },
  browser: {
    all: {
      outputs: [
        'faviconIco',
        'faviconPng',
        'indexHtml',
        'maskableIcon',
        'serviceWorker',
        'webAppManifest',
      ],
      tags: [
        'applicationName',
        'themeColor',
      ],
    },
    and_chr: {
      outputs: [],
      tags: [
        'mobileWebAppCapable',
      ],
    },
    edge: {
      outputs: [
        'browserconfigXml',
        'windowsTile',
        'windowsTileSmall',
      ],
      tags: [],
    },
    ie: {
      outputs: [
        'browserconfigXml',
        'windowsTile',
        'windowsTileSmall',
      ],
      tags: [],
    },
    ios_saf: {
      outputs: [
        'safariMaskIcon',
      ],
      tags: [
        'appleMobile',
      ],
    },
    safari: {
      outputs: [
        'safariMaskIcon',
      ],
      tags: [],
    },
  },
  installer: {
    dmg: {
      outputs: [
        'dmgBackground',
      ],
      tags: [],
    },
  },
  os: {
    ios: {
      outputs: [
        'appleTouchIcon',
        'appleTouchStartup',
      ],
      tags: [],
    },
    macos: {
      outputs: [
        'macosIcns',
      ],
      tags: [],
    },
    windows: {
      outputs: [
        'windowsIco',
      ],
      tags: [],
    },
  },
  web: {
    facebook: {
      outputs: [
        'facebookAppIcon',
        'openGraphImage',
      ],
      tags: [
        'openGraph',
      ],
    },
    reddit: {
      outputs: [
        'openGraphImage',
      ],
      tags: [
        'openGraph',
      ],
    },
    twitter: {
      outputs: [
        'twitterCardImage',
      ],
      tags: [
        'twitter',
      ],
    },
  },
}
