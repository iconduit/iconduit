const {
  selectManifestDescription,
  selectManifestLanguage,
  selectManifestMaskColor,
  selectManifestName,
  selectManifestThemeColor,
  selectOutputHeight,
  selectOutputHtmlSizes,
  selectOutputPath,
  selectOutputType,
  selectOutputWidth,
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
          content: selectManifestName,
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
          content: selectManifestName,
        },
        sortWeight: 2000,
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
          color: selectManifestMaskColor,
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
        sortWeight: 4000,
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
          content: selectManifestLanguage,
        },
        predicate: [
          selectManifestLanguage,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:site_name',
          content: selectManifestName,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:title',
          content: selectManifestName,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:description',
          content: selectManifestDescription,
        },
        predicate: [
          selectManifestDescription,
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
          content: selectManifestName,
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
          content: selectManifestThemeColor,
        },
        sortWeight: 3000,
      },
    ],
  },
  twitter: {
    twitter: [
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:title',
          content: selectManifestName,
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:description',
          content: selectManifestDescription,
        },
        predicate: [
          selectManifestDescription,
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
          content: selectManifestName,
        },
      },
    ],
  },
}
