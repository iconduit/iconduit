module.exports = {
  appleTouchIcon: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconFlatMaskable', style: 'appleTouchIconScale'},
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
      to: 'iconMaskableNoPadding',
    },
  },
  favicon: {
    strategy: 'degrade',
    options: {
      to: 'iconMaskedNoPadding',
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
  githubAccountIcon: {
    strategy: 'degrade',
    options: {
      to: 'iconMaskedNoPadding',
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
  iconMaskableNoPadding: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconMaskable', style: 'noPaddingIconScale'},
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
  iconMaskedNoPadding: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconMasked', style: 'noPaddingIconScale'},
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
        {input: 'iconFlatMasked', style: 'macosIconScale'},
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
        {input: 'iconMaskable', style: 'webAppIconMaskableScale'},
      ],
    },
  },
  webAppIconMasked: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconMasked', style: 'webAppIconMaskedScale'},
      ],
    },
  },
  windowsIco: {
    strategy: 'degrade',
    options: {
      to: 'iconMaskedNoPadding',
    },
  },
  windowsTile: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'windowsTileIcon', style: 'windowsTileIconScale'},
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
        {input: 'windowsTileIcon', style: 'windowsTileIconScaleSmall'},
      ],
    },
  },
}
