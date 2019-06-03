module.exports = () => {
  return {
    name: 'Iconduit',
    description: 'A build system for web application icon and image assets',
    url: 'https://iconduit.github.io/',
    colors: {
      brand: '#D5415C',
    },
    masks: {
      primary: 'iconMaskAndroidSquircle',
      output: {
        appleTouchIconMasked: 'iconMaskIosSquircle',
        webAppIconMasked: 'iconMaskAndroidCircle',
      },
    },
    definitions: {
      output: {
        appleTouchIconMasked: {
          input: 'appleTouchIcon',
          name: 'apple-touch-icon-masked-[dimensions].png',
          options: {
            isMasked: true,
          },
          sizes: ['appleTouchIconRetina'],
        },
      },
    },
    outputs: {
      include: [
        'appleTouchIconMasked',
      ],
    },
    extra: {
      license: 'MIT',
    },
  }
}
