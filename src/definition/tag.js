module.exports = [
  {
    name: 'apple-mobile',
    section: {
      head: [
        {
          tag: 'meta',
          attributes: {
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          children: [],
          isVoid: false,
        },
        {
          tag: 'meta',
          attributes: {
            name: 'apple-mobile-web-app-title',
            content: {$ref: 'manifest#/name'},
          },
          children: [],
          isVoid: false,
        },
      ],
    },
  },
  {
    name: 'apple-touch-icon',
    section: {
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
        },
      ],
    },
  },
]
