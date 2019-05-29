module.exports = {
  appleTouchIcon: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconFlatMaskable', multiplier: 2, style: 'appleTouchIconScale'},
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
      to: 'iconMaskable',
    },
  },
  favicon: {
    strategy: 'degrade',
    options: {
      to: 'iconMaskedMinimalPadding',
    },
  },
  faviconIco: {
    strategy: 'degrade',
    options: {
      to: 'favicon',
    },
  },
  faviconPng: {
    strategy: 'degrade',
    options: {
      to: 'favicon',
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
  iconFlat: {
    strategy: 'degrade',
    options: {
      to: 'icon',
    },
  },
  iconFlatBackground: {
    strategy: 'degrade',
    options: {
      to: 'iconBackground',
    },
  },
  iconFlatBleed: {
    strategy: 'degrade',
    options: {
      to: 'iconBleed',
    },
  },
  iconFlatForeground: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconFlat'},
        {input: 'iconFlatBleed'},
      ],
    },
  },
  iconFlatMaskable: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconFlatForeground'},
        {input: 'iconFlatBackground'},
      ],
    },
  },
  iconFlatMasked: {
    strategy: 'composite',
    options: {
      mask: 'iconMask',
      layers: [
        {input: 'iconFlatForeground'},
        {input: 'iconFlatBackground'},
      ],
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
  iconMaskable: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconForeground'},
        {input: 'iconBackground'},
      ],
    },
  },
  iconMasked: {
    strategy: 'composite',
    options: {
      mask: 'iconMask',
      layers: [
        {input: 'iconForeground'},
        {input: 'iconBackground'},
      ],
    },
  },
  iconMaskedMinimalPadding: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconMasked', multiplier: 2, style: 'minimalPaddingIconScale'},
      ],
    },
  },
  iconSilhouette: {
    strategy: 'degrade',
    options: {
      to: 'iconFlat',
    },
  },
  macosIcns: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconFlatMasked', multiplier: 2, style: 'macosIconScale'},
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
  webAppIconMaskable: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconMaskable', multiplier: 2, style: 'webAppIconMaskableScale'},
      ],
    },
  },
  webAppIconMasked: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconMasked', multiplier: 2, style: 'webAppIconMaskedScale'},
      ],
    },
  },
  windowsIco: {
    strategy: 'degrade',
    options: {
      to: 'iconMaskedMinimalPadding',
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
