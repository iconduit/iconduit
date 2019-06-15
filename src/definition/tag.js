const {
  selectAbsoluteOutputUrl,
  selectAbsoluteStartUrl,
  selectAppleTouchStartupMedia,
  selectDescription,
  selectDeterminer,
  selectFacebookAppId,
  selectIosStatusBarStyle,
  selectIosStatusBarStyleIsNotDefault,
  selectLocale,
  selectMaskColor,
  selectName,
  selectOutputHeight,
  selectOutputHtmlSizes,
  selectOutputType,
  selectOutputUrl,
  selectOutputWidth,
  selectPrimaryIosApp,
  selectPrimaryIosAppBannerString,
  selectPrimaryIosAppCountry,
  selectPrimaryIosAppId,
  selectPrimaryIosAppLaunchUrl,
  selectPrimaryPlayApp,
  selectPrimaryPlayAppId,
  selectPrimaryPlayAppLaunchUrl,
  selectPrimaryWindowsApp,
  selectPrimaryWindowsAppId,
  selectPrimaryWindowsAppLaunchUrl,
  selectThemeColor,
  selectTileColor,
  selectTwitterCardType,
  selectTwitterCardTypeIsApp,
  selectTwitterCardTypeIsSummary,
  selectTwitterCreatorHandle,
  selectTwitterDescription,
  selectTwitterSiteHandle,
  selectViewport,
} = require('../selector.js')

module.exports = {
  appleItunesApp: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          name: 'apple-itunes-app',
          content: selectPrimaryIosAppBannerString,
        },
        predicate: [
          selectPrimaryIosAppBannerString,
        ],
      },
    ],
  },
  appleMobile: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        sortWeight: 1000,
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-title',
          content: selectName,
        },
        sortWeight: 2000,
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-status-bar-style',
          content: selectIosStatusBarStyle,
        },
        sortWeight: 4000,
        predicate: [
          selectIosStatusBarStyleIsNotDefault,
        ],
      },
    ],
  },
  appleTouchIcon: {
    icon: [
      {
        tag: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          href: selectOutputUrl,
        },
        sortWeight: -1,
      },
    ],
  },
  appleTouchStartup: {
    appleTouchStartup: [
      {
        tag: 'link',
        attributes: {
          rel: 'apple-touch-startup-image',
          href: selectOutputUrl,
          media: selectAppleTouchStartupMedia,
        },
        sortWeight: 0,
      },
    ],
  },
  applicationName: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'application-name',
          content: selectName,
        },
        sortWeight: 2000,
      },
    ],
  },
  appLinks: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          property: 'al:android:url',
          content: selectPrimaryPlayAppLaunchUrl,
        },
        predicate: [
          selectPrimaryPlayAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:android:package',
          content: selectPrimaryPlayAppId,
        },
        predicate: [
          selectPrimaryPlayAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:android:app_name',
          content: selectName,
        },
        predicate: [
          selectPrimaryPlayApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:ios:url',
          content: selectPrimaryIosAppLaunchUrl,
        },
        predicate: [
          selectPrimaryIosAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:ios:app_store_id',
          content: selectPrimaryIosAppId,
        },
        predicate: [
          selectPrimaryIosAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:ios:app_name',
          content: selectName,
        },
        predicate: [
          selectPrimaryIosApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:web:url',
          content: selectAbsoluteStartUrl,
        },
        predicate: [
          selectAbsoluteStartUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:windows:url',
          content: selectPrimaryWindowsAppLaunchUrl,
        },
        predicate: [
          selectPrimaryWindowsAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:windows:package',
          content: selectPrimaryWindowsAppId,
        },
        predicate: [
          selectPrimaryWindowsAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:windows:app_name',
          content: selectName,
        },
        predicate: [
          selectPrimaryWindowsApp,
        ],
      },
    ],
  },
  facebook: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          property: 'fb:app_id',
          content: selectFacebookAppId,
        },
        predicate: [
          selectFacebookAppId,
        ],
      },
    ],
  },
  icon: {
    icon: [
      {
        tag: 'link',
        attributes: {
          rel: 'icon',
          type: selectOutputType,
          href: selectOutputUrl,
          sizes: selectOutputHtmlSizes,
        },
      },
    ],
  },
  manifest: {
    link: [
      {
        tag: 'link',
        attributes: {
          rel: 'manifest',
          href: selectOutputUrl,
        },
      },
    ],
  },
  maskIcon: {
    icon: [
      {
        tag: 'link',
        attributes: {
          rel: 'mask-icon',
          href: selectOutputUrl,
          color: selectMaskColor,
        },
      },
    ],
  },
  mobileWebAppCapable: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'mobile-web-app-capable',
          content: 'yes',
        },
        sortWeight: 1000,
      },
    ],
  },
  msapplicationTileColor: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-TileColor',
          content: selectTileColor,
        },
        sortWeight: 5000,
      },
    ],
  },
  msapplicationTileImage: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-TileImage',
          content: selectOutputUrl,
        },
        sortWeight: 5100,
      },
    ],
  },
  msapplicationConfig: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-config',
          content: selectOutputUrl,
        },
        sortWeight: 5200,
      },
    ],
  },
  openGraph: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          property: 'og:type',
          content: 'website',
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:locale',
          content: selectLocale,
        },
        predicate: [
          selectLocale,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:url',
          content: selectAbsoluteStartUrl,
        },
        predicate: [
          selectAbsoluteStartUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:site_name',
          content: selectName,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:determiner',
          content: selectDeterminer,
        },
        predicate: [
          selectDeterminer,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:title',
          content: selectName,
        },
        predicate: [
          selectName,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:description',
          content: selectDescription,
        },
        predicate: [
          selectDescription,
        ],
      },
    ],
  },
  openGraphImage: {
    graphImage: [
      {
        tag: 'meta',
        attributes: {
          property: 'og:image',
          content: selectAbsoluteOutputUrl,
        },
        predicate: [
          selectAbsoluteOutputUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:type',
          content: selectOutputType,
        },
        predicate: [
          selectAbsoluteOutputUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:width',
          content: selectOutputWidth,
        },
        predicate: [
          selectAbsoluteOutputUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:height',
          content: selectOutputHeight,
        },
        predicate: [
          selectAbsoluteOutputUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:alt',
          content: selectName,
        },
        predicate: [
          selectAbsoluteOutputUrl,
        ],
      },
    ],
  },
  themeColor: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'theme-color',
          content: selectThemeColor,
        },
        sortWeight: 4000,
      },
    ],
  },
  twitter: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:card',
          content: selectTwitterCardType,
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:site',
          content: selectTwitterSiteHandle,
        },
        predicate: [
          selectTwitterSiteHandle,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:creator',
          content: selectTwitterCreatorHandle,
        },
        predicate: [
          selectTwitterCardTypeIsSummary,
          selectTwitterCreatorHandle,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:title',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsSummary,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:description',
          content: selectTwitterDescription,
        },
        predicate: [
          selectTwitterDescription,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:country',
          content: selectPrimaryIosAppCountry,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppCountry,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:name:iphone',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:id:iphone',
          content: selectPrimaryIosAppId,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:url:iphone',
          content: selectPrimaryIosAppLaunchUrl,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:name:ipad',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:id:ipad',
          content: selectPrimaryIosAppId,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:url:ipad',
          content: selectPrimaryIosAppLaunchUrl,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:name:googleplay',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryPlayApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:id:googleplay',
          content: selectPrimaryPlayAppId,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryPlayAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:url:googleplay',
          content: selectPrimaryPlayAppLaunchUrl,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryPlayAppLaunchUrl,
        ],
      },
    ],
  },
  twitterImage: {
    graphImage: [
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image',
          content: selectAbsoluteOutputUrl,
        },
        predicate: [
          selectAbsoluteOutputUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image:alt',
          content: selectName,
        },
        predicate: [
          selectAbsoluteOutputUrl,
        ],
      },
    ],
  },
  viewport: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'viewport',
          content: selectViewport,
        },
        sortWeight: 3000,
      },
    ],
  },
}
