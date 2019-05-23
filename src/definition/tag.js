module.exports = {
  appleMobile: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 1000,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-title',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 2000,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: -1,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 2000,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 1000,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 4000,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:locale',
          content: {$ref: 'manifest#/language'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [
          {$ref: 'manifest#/language'},
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:site_name',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:title',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:description',
          content: {$ref: 'manifest#/description'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [
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
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:type',
          content: {$ref: 'output#/type'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:width',
          content: {$ref: 'output#/size/width'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:height',
          content: {$ref: 'output#/size/height'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:alt',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 3000,
        dependencies: [],
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
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:title',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:description',
          content: {$ref: 'manifest#/description'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [
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
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image:alt',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 0,
        dependencies: [],
      },
    ],
  },
}
