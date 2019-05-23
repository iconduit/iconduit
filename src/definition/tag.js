const {
  TAG_WEIGHT_META,
  TAG_WEIGHT_FIRST_ICON,
  TAG_WEIGHT_ICON,
} = require('../constant.js')

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
        sortWeight: TAG_WEIGHT_META,
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-title',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isSelfClosing: true,
        sortWeight: TAG_WEIGHT_META,
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
        sortWeight: TAG_WEIGHT_FIRST_ICON,
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
        sortWeight: TAG_WEIGHT_META,
      },
    ],
  },
  icon: {
    head: [
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
        sortWeight: TAG_WEIGHT_ICON,
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
        sortWeight: TAG_WEIGHT_META,
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
        sortWeight: TAG_WEIGHT_META,
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
        sortWeight: TAG_WEIGHT_META,
      },
    ],
  },
}
