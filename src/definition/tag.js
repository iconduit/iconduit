const {
  selectDescription,
  selectFacebookAppId,
  selectLocale,
  selectMaskColor,
  selectName,
  selectOpenGraphDeterminer,
  selectOutputHeight,
  selectOutputHtmlSizes,
  selectOutputPath,
  selectOutputType,
  selectOutputWidth,
  selectPrimaryIosApp,
  selectPrimaryIosAppCountry,
  selectPrimaryIosAppId,
  selectPrimaryIosAppLaunchUrl,
  selectPrimaryPlayApp,
  selectPrimaryPlayAppId,
  selectPrimaryPlayAppLaunchUrl,
  selectThemeColor,
  selectTwitterCardType,
  selectTwitterCardTypeIsApp,
  selectTwitterCardTypeIsSummary,
  selectTwitterCreatorHandle,
  selectTwitterDescription,
  selectTwitterSiteHandle,
  selectUrl,
  selectViewport,
} = require('../selector.js')

module.exports = {
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
    ],
  },
  appleTouchIcon: {
    icon: [
      {
        tag: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          href: selectOutputPath,
          sizes: selectOutputHtmlSizes,
        },
        sortWeight: -1,
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
  facebook: {
    openGraph: [
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
          href: selectOutputPath,
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
          href: selectOutputPath,
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
          href: selectOutputPath,
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
  msapplicationConfig: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-config',
          content: selectOutputPath,
        },
        sortWeight: 5000,
      },
    ],
  },
  openGraph: {
    openGraph: [
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
          content: selectUrl,
        },
        predicate: [
          selectUrl,
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
          content: selectOpenGraphDeterminer,
        },
        predicate: [
          selectOpenGraphDeterminer,
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
    openGraphImage: [
      {
        tag: 'meta',
        attributes: {
          property: 'og:image',
          content: selectOutputPath,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:type',
          content: selectOutputType,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:width',
          content: selectOutputWidth,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:height',
          content: selectOutputHeight,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:alt',
          content: selectName,
        },
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
    twitter: [
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
    twitterImage: [
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image',
          content: selectOutputPath,
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image:alt',
          content: selectName,
        },
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
