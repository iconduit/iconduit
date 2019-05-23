module.exports = {
  appleMobile: {
    head: [
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 100,
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-title',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 100,
      },
    ],
  },
  appleTouchIcon: {
    head: [
      {
        tag: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          href: {$ref: 'output#/path'},
          sizes: {$ref: 'output#/htmlSizes'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 200,
      },
    ],
  },
  applicationName: {
    head: [
      {
        tag: 'meta',
        attributes: {
          name: 'application-name',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 100,
      },
    ],
  },
  mobileWebAppCapable: {
    head: [
      {
        tag: 'meta',
        attributes: {
          name: 'mobile-web-app-capable',
          content: 'yes',
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 100,
      },
    ],
  },
  msapplicationConfig: {
    head: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-config',
          content: {$ref: 'output#/path'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 100,
      },
    ],
  },
  themeColor: {
    head: [
      {
        tag: 'meta',
        attributes: {
          name: 'theme-color',
          content: {$ref: 'manifest#/color/theme'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: 100,
      },
    ],
  },
}
