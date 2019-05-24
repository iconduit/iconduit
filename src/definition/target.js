module.exports = {
  all: {
    outputs: [
      'iconduitManifest',
    ],
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

    },
    ie: {
      outputs: [
        'browserconfigXml',
        'windowsTile',
        'windowsTileSmall',
      ],

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

    },
  },
  installer: {
    dmg: {
      outputs: [
        'dmgBackground',
      ],

    },
  },
  os: {
    ios: {
      outputs: [
        'appleTouchIcon',
        'appleTouchStartup',
      ],

    },
    macos: {
      outputs: [
        'macosIcns',
      ],

    },
    windows: {
      outputs: [
        'windowsIco',
      ],

    },
  },
  web: {
    facebook: {
      outputs: [
        'facebookAppIcon',
        'openGraphImage',
      ],
      tags: [
        'facebook',
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
