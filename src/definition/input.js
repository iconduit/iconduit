module.exports = {
  appleTouchIcon: {
    strategy: 'composite',
    options: {
      backgroundColor: 'transparent',
      mask: null,
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
      mask: null,
      layers: [
        {input: 'iconSilhouette', multiplier: 1, style: 'opacity10Percent'},
        {input: 'backgroundColor', multiplier: 1, style: null},
      ],
    },
  },
  facebookAppIcon: {
    strategy: 'degrade',
    options: {
      to: 'maskableIcon',
    },
  },
  maskedIconMinimalPadding: {
    strategy: 'composite',
    options: {
      backgroundColor: 'transparent',
      mask: null,
      layers: [
        {input: 'maskedIcon', multiplier: 2, style: 'maskedIconMinimalPaddingScale'},
      ],
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
      backgroundColor: 'transparent',
      mask: null,
      layers: [
        {input: 'icon', multiplier: 1, style: null},
        {input: 'iconBleed', multiplier: 1, style: null},
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
      backgroundColor: 'transparent',
      mask: null,
      layers: [
        {input: 'maskedIconWithoutBleed', multiplier: 2, style: 'macosIconScale'},
      ],
    },
  },
  maskableIcon: {
    strategy: 'composite',
    options: {
      backgroundColor: 'transparent',
      mask: null,
      layers: [
        {input: 'iconForeground', multiplier: 1, style: null},
        {input: 'iconBackground', multiplier: 1, style: null},
      ],
    },
  },
  maskedIcon: {
    strategy: 'composite',
    options: {
      backgroundColor: 'transparent',
      mask: 'iconMask',
      layers: [
        {input: 'iconForeground', multiplier: 1, style: null},
        {input: 'iconBackground', multiplier: 1, style: null},
      ],
    },
  },
  maskedIconWithoutBleed: {
    strategy: 'composite',
    options: {
      backgroundColor: 'transparent',
      mask: 'iconMask',
      layers: [
        {input: 'icon', multiplier: 1, style: null},
        {input: 'iconBackground', multiplier: 1, style: null},
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
      backgroundColor: 'transparent',
      mask: null,
      layers: [
        {input: 'iconSilhouette', multiplier: 1, style: null},
        {input: 'backgroundColor', multiplier: 1, style: null},
      ],
    },
  },
  twitterCardImage: {
    strategy: 'degrade',
    options: {
      to: 'socialShareImage',
    },
  },
  windowsTile: {
    strategy: 'composite',
    options: {
      backgroundColor: 'transparent',
      mask: null,
      layers: [
        {input: 'windowsTileIcon', multiplier: 1, style: 'windowsTileIconPosition'},
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
      backgroundColor: 'transparent',
      mask: null,
      layers: [
        {input: 'windowsTileIcon', multiplier: 1, style: 'windowsTileIconPositionSmall'},
      ],
    },
  },
}
