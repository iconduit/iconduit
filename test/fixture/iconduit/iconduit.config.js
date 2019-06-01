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
        webAppIconMasked: 'iconMaskAndroidCircle',
      },
    },
    definitions: {
      output: {
        appleTouchIconMasked: {
          input: 'appleTouchIcon',
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
