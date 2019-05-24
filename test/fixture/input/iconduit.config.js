module.exports = {
  name: 'Iconduit',
  description: 'A build system for web application icon and image assets',
  url: 'https://iconduit.app/',
  definitions: {
    color: {
      iconduitorange: '#D58B41',
      iconduitpink: '#D5415C',
    },
    input: {
      appleTouchIconMasked: {
        strategy: 'composite',
        options: {
          mask: 'iconMaskIosSquircle',
          layers: [
            {input: 'icon', multiplier: 2, style: 'appleTouchIconScale'},
            {input: 'iconBackground', multiplier: 2, style: 'appleTouchIconScale'},
          ],
        },
      },
      iconMask: {
        strategy: 'degrade',
        options: {
          to: 'iconMaskAndroidSquircle',
        },
      },
    },
    output: {
      appleTouchIconMasked: {
        input: 'appleTouchIconMasked',
        name: 'apple-touch-icon-masked-[dimensions].png',
        sizes: ['appleTouchIconRetina'],
      },
    },
  },
  colors: {
    background: 'iconduitpink',
    theme: 'iconduitorange',
  },
  inputs: {
    icon: './icon/icon.png',
    iconBackground: './icon/background.svg',
    iconBleed: './icon/bleed.svg',
    iconSilhouette: './icon/silhouette.svg',
  },
  outputs: {
    include: [
      'appleTouchIconMasked',
    ],
    exclude: [
    ],
  },
  applications: {
    native: [
      {
        platform: 'itunes',
        id: '915056765',
        launchUrl: 'iconduit://dashboard',
      },
      {
        platform: 'play',
        id: 'com.google.android.apps.maps',
        launchUrl: 'https://iconduit.app/dashboard',
      },
      {
        platform: 'windows',
        id: '9wzdncrdtbvb',
      },
    ],
    web: {
      facebook: {
        appId: '123456789012345',
      },
      twitter: {
        cardType: 'app',
        creatorHandle: 'ezzatron',
        siteHandle: 'iconduitapp',
      },
    },
  },
}
