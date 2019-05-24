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
          content: {$ref: 'manifest#/name'},
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
          href: {$ref: 'output#/path'},
          sizes: {$ref: 'output#/htmlSizes'},
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
          content: {$ref: 'manifest#/name'},
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
          type: {$ref: 'output#/type'},
          href: {$ref: 'output#/path'},
          sizes: {$ref: 'output#/htmlSizes'},
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
          href: {$ref: 'output#/path'},
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
          href: {$ref: 'output#/path'},
          color: {$ref: 'manifest#/color/mask'},
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
          content: {$ref: 'output#/path'},
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
          content: {$ref: 'manifest#/language'},
        },
        predicate: [
          {$ref: 'manifest#/language'},
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:site_name',
          content: {$ref: 'manifest#/name'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:title',
          content: {$ref: 'manifest#/name'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:description',
          content: {$ref: 'manifest#/description'},
        },
        predicate: [
          {$ref: 'manifest#/description'},
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
          content: {$ref: 'output#/path'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:type',
          content: {$ref: 'output#/type'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:width',
          content: {$ref: 'output#/size/width'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:height',
          content: {$ref: 'output#/size/height'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:alt',
          content: {$ref: 'manifest#/name'},
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
          content: {$ref: 'manifest#/color/theme'},
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
          content: {$ref: 'manifest#/name'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:description',
          content: {$ref: 'manifest#/description'},
        },
        predicate: [
          {$ref: 'manifest#/description'},
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
          content: {$ref: 'output#/path'},
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image:alt',
          content: {$ref: 'manifest#/name'},
        },
      },
    ],
  },
}
