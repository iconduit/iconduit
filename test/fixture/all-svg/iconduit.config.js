export default () => {
  return {
    name: 'Iconduit',
    description: 'A build system for web application icon and image assets',
    urls: {
      base: 'https://iconduit.github.io/',
    },
    colors: {
      brand: '#D5415C',
    },
    masks: {
      primary: 'iconMaskAndroidSquircle',
      output: {
        appleTouchIconMasked: 'iconMaskIosSquircle',
        webAppIconMasked: 'iconMaskAndroidCircle',
      },
    },
    os: {
      ios: {
        statusBarStyle: 'black-translucent',
      },
    },
    definitions: {
      input: {
        windowsTileLarge: {
          strategy: 'degrade',
          options: {
            to: 'windowsTileIcon',
          },
        },
        windowsTileMedium: {
          strategy: 'degrade',
          options: {
            to: 'windowsTileIcon',
          },
        },
        windowsTileSmall: {
          strategy: 'degrade',
          options: {
            to: 'windowsTileIconSmall',
          },
        },
        windowsTileWide: {
          strategy: 'degrade',
          options: {
            to: 'windowsTileIcon',
          },
        },
      },
      output: {
        appleTouchIconMasked: {
          input: 'appleTouchIcon',
          name: 'apple-touch-icon-masked-[dimensions].png',
          options: {
            isMasked: true,
          },
          sizes: ['appleTouchIconRetina'],
        },
      },
    },
    outputs: {
      include: [
        'appleTouchIconMasked',
      ],
      exclude: [
        'serviceWorker',
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
          launchUrl: 'iconduit://dashboard',
        },
      ],
    },
    extra: {
      license: 'MIT',
    },
  }
}
