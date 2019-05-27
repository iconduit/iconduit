module.exports = () => {
  return {
    name: 'Iconduit',
    description: 'A build system for web application icon and image assets',
    colors: {
      brand: '#D5415C'
    },
    definitions: {
      input: {
        appleTouchIconMasked: {
          strategy: 'composite',
          options: {
            mask: 'iconMaskIosSquircle',
            layers: [
              {input: 'icon', multiplier: 2, style: 'appleTouchIconScale'},
              {input: 'iconBackground', multiplier: 2, style: 'appleTouchIconScale'},
            ],
          },
        },
      },
      output: {
        appleTouchIconMasked: {
          name: 'apple-touch-icon-masked-[dimensions].png',
          sizes: ['appleTouchIconRetina'],
        },
      },
    },
    outputs: {
      include: [
        'appleTouchIconMasked',
      ],
    },
  }
}
