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
      },
    ],
  },
}
