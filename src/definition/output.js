const {buildWebAppManifest} = require('../web-app.js')

module.exports = {
  appleTouchIcon: {
    name: 'apple-touch-icon-[dimensions].png',
    options: {
      isTransparent: false,
    },
    sizes: ['appleTouchIconRetina'],
    tags: [
      'appleTouchIcon',
    ],
  },
  appleTouchStartup: {
    name: 'apple-touch-startup-[dimensions]r[pixelRatio].png',
    options: {
      isTransparent: false,
    },
    sizes: [
      'display.ipad1536x2048d264.landscape',
      'display.ipad1536x2048d264.portrait',
      'display.ipad1536x2048d326.landscape',
      'display.ipad1536x2048d326.portrait',
      'display.ipad1620x2160d264.landscape',
      'display.ipad1620x2160d264.portrait',
      'display.ipad1640x2360d264.landscape',
      'display.ipad1640x2360d264.portrait',
      'display.ipad1668x2224d264.landscape',
      'display.ipad1668x2224d264.portrait',
      'display.ipad1668x2388d264.landscape',
      'display.ipad1668x2388d264.portrait',
      'display.ipad2048x2732d264.landscape',
      'display.ipad2048x2732d264.portrait',
      'display.iphone1080x2340d476.landscape',
      'display.iphone1080x2340d476.portrait',
      'display.iphone1125x2436d458.landscape',
      'display.iphone1125x2436d458.portrait',
      'display.iphone1170x2532d460.landscape',
      'display.iphone1170x2532d460.portrait',
      'display.iphone1242x2208d462.landscape',
      'display.iphone1242x2208d462.portrait',
      'display.iphone1242x2688d458.landscape',
      'display.iphone1242x2688d458.portrait',
      'display.iphone1284x2778d458.landscape',
      'display.iphone1284x2778d458.portrait',
      'display.iphone640x1136d326.landscape',
      'display.iphone640x1136d326.portrait',
      'display.iphone750x1334d326.landscape',
      'display.iphone750x1334d326.portrait',
      'display.iphone828x1792d326.landscape',
      'display.iphone828x1792d326.portrait',
    ],
    tags: [
      'appleTouchStartup',
    ],
  },
  browserconfigXml: {
    name: 'browserconfig.xml',
    tags: [
      'msapplicationConfig',
    ],
  },
  dmgBackground: {
    name: 'dmg-background[atPixelRatioX].png',
    options: {
      isTransparent: false,
    },
    sizes: ['dmgBackground@2x', 'dmgBackground'],
  },
  facebookAppIcon: {
    name: 'facebook-app-icon.png',
    options: {
      isTransparent: false,
    },
    sizes: ['facebookAppIcon'],
  },
  githubAccountIcon: {
    name: 'github-account-icon.png',
    sizes: ['githubAccountIcon'],
  },
  faviconIco: {
    name: 'favicon.ico',
    sizes: ['faviconLarge', 'faviconMedium', 'faviconSmall'],
  },
  faviconPng: {
    name: 'favicon-[dimensions].png',
    sizes: ['faviconMedium', 'faviconSmall'],
    tags: [
      'icon',
    ],
  },
  iconduitConsumer: {
    name: 'iconduit.consumer.js',
  },
  iconduitManifest: {
    name: 'site.iconduitmanifest',
  },
  indexHtml: {
    name: 'index.html',
  },
  macosIcns: {
    name: 'macos.icns',
    sizes: [
      'icns512@2x',
      'icns512',
      'icns256@2x',
      'icns256',
      'icns128@2x',
      'icns128',
      'icns32@2x',
      'icns32',
      'icns16@2x',
      'icns16',
    ],
  },
  notificationBadge: {
    name: 'notification-badge.png',
    sizes: ['notificationBadge'],
  },
  notificationIcon: {
    name: 'notification-icon.png',
    sizes: ['notificationIcon'],
  },
  openGraphImage: {
    name: 'open-graph.png',
    options: {
      isTransparent: false,
    },
    sizes: ['openGraphImage'],
    tags: [
      'openGraphImage',
    ],
  },
  safariMaskIcon: {
    name: 'safari-mask-icon.svg',
    tags: [
      'maskIcon',
    ],
  },
  serviceWorker: {
    name: 'service-worker.js',
  },
  tagsHtml: {
    name: 'tags.html',
  },
  twitterCardImage: {
    name: 'twitter-card.png',
    options: {
      isTransparent: false,
    },
    sizes: ['twitterCardImage'],
    tags: [
      'twitterImage',
    ],
  },
  webAppIconMaskable: {
    name: 'web-app-icon-maskable-[dimensions].png',
    sizes: ['webAppIconLarge', 'webAppIconMedium', 'webAppIconSmall'],
  },
  webAppIconMasked: {
    name: 'web-app-icon-masked-[dimensions].png',
    sizes: ['webAppIconLarge', 'webAppIconMedium', 'webAppIconSmall'],
  },
  webAppManifest: {
    name: 'site.webmanifest',
    options: {
      variables: {buildWebAppManifest},
    },
    tags: [
      'manifest',
    ],
  },
  windowsIco: {
    name: 'windows.ico',
    sizes: [
      'windowsIco256',
      'windowsIco128',
      'windowsIco96',
      'windowsIco64',
      'windowsIco48',
      'windowsIco40',
      'windowsIco32',
      'windowsIco24',
      'windowsIco22',
      'windowsIco16',
    ],
  },
  windowsTileLarge: {
    name: 'windows-tile-[dimensions].png',
    sizes: ['windowsTileLarge@2x'],
  },
  windowsTileMedium: {
    name: 'windows-tile-[dimensions].png',
    sizes: ['windowsTileMedium@2x'],
    tags: [
      'msapplicationTileImage',
    ],
  },
  windowsTileSmall: {
    name: 'windows-tile-[dimensions].png',
    sizes: ['windowsTileSmall@2x'],
  },
  windowsTileWide: {
    name: 'windows-tile-[dimensions].png',
    sizes: ['windowsTileWide@2x'],
  },
}
