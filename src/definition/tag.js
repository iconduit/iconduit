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
        isVoid: false,
        sortWeight: 100,
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-title',
          content: {$ref: 'manifest#/name'},
        },
        children: [],
        isVoid: false,
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
        isVoid: false,
        sortWeight: 100,
      },
    ],
  },
}
