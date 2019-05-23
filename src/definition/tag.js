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
}
