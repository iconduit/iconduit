module.exports = {
  appleTouchIcon: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'icon', multiplier: 2, style: 'appleTouchIconScale'},
        {input: 'iconBackground', multiplier: 2, style: 'appleTouchIconScale'},
      ],
    },
  },
  appleTouchStartup: {
    strategy: 'composite',
    options: {
      backgroundColor: 'white',
      layers: [
        {input: 'iconSilhouette', style: 'opacity10Percent'},
        {input: 'backgroundColor'},
      ],
    },
  },
  facebookAppIcon: {
    strategy: 'degrade',
    options: {
      to: 'maskableIconWithoutBleed',
    },
  },
  iconBackground: {
    strategy: 'degrade',
    options: {
      to: 'backgroundColor',
    },
  },
  iconBleed: {
    strategy: 'degrade',
    options: {
      to: 'transparent',
    },
  },
  iconForeground: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'icon'},
        {input: 'iconBleed'},
      ],
    },
  },
  iconMask: {
    strategy: 'degrade',
    options: {
      to: 'iconMaskAndroidCircle',
    },
  },
  iconSilhouette: {
    strategy: 'degrade',
    options: {
      to: 'icon',
    },
  },
  macosIcon: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'maskedIconWithoutBleed', multiplier: 2, style: 'macosIconScale'},
      ],
    },
  },
  maskableIcon: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconForeground'},
        {input: 'iconBackground'},
      ],
    },
  },
  maskedIcon: {
    strategy: 'composite',
    options: {
      mask: 'iconMask',
      layers: [
        {input: 'iconForeground'},
        {input: 'iconBackground'},
      ],
    },
  },
  maskedIconMinimalPadding: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'maskedIcon', multiplier: 2, style: 'maskedIconMinimalPaddingScale'},
      ],
    },
  },
  maskableIconWithoutBleed: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'icon'},
        {input: 'iconBackground'},
      ],
    },
  },
  maskedIconWithoutBleed: {
    strategy: 'composite',
    options: {
      mask: 'iconMask',
      layers: [
        {input: 'icon'},
        {input: 'iconBackground'},
      ],
    },
  },
  openGraphImage: {
    strategy: 'degrade',
    options: {
      to: 'socialShareImage',
    },
  },
  safariMaskIcon: {
    strategy: 'degrade',
    options: {
      to: 'iconSilhouette',
    },
  },
  socialShareImage: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconSilhouette'},
        {input: 'backgroundColor'},
      ],
    },
  },
  twitterCardImage: {
    strategy: 'degrade',
    options: {
      to: 'socialShareImage',
    },
  },
  webAppMaskableIcon: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'maskableIcon', multiplier: 2, style: 'webAppMaskableIconScale'},
      ],
    },
  },
  webAppMaskedIcon: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'maskedIcon', multiplier: 2, style: 'webAppMaskedIconScale'},
      ],
    },
  },
  windowsTile: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'windowsTileIcon', multiplier: 2, style: 'windowsTileIconScale'},
      ],
    },
  },
  windowsTileIcon: {
    strategy: 'degrade',
    options: {
      to: 'iconSilhouette',
    },
  },
  windowsTileSmall: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'windowsTileIcon', multiplier: 2, style: 'windowsTileIconScaleSmall'},
      ],
    },
  },
}
