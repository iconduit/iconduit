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
      layers: [
        {input: 'backgroundColor'},
        {input: 'iconSilhouette', style: 'opacity10Percent'},
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
        {input: 'iconFlatBleed'},
        {input: 'iconFlat'},
      ],
    },
  },
  iconFlatMaskable: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconFlatBackground'},
        {input: 'iconFlatForeground'},
      ],
    },
  },
  iconFlatMasked: {
    strategy: 'composite',
    options: {
      isMasked: true,
      layers: [
        {input: 'iconFlatBackground'},
        {input: 'iconFlatForeground'},
      ],
    },
  },
  iconForeground: {
    strategy: 'composite',
    options: {
      layers: [
        {input: 'iconBleed'},
        {input: 'icon'},
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
        {input: 'iconBackground'},
        {input: 'iconForeground'},
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
      isMasked: true,
      layers: [
        {input: 'iconBackground'},
        {input: 'iconForeground'},
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
        {input: 'backgroundColor'},
        {input: 'iconSilhouette'},
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
        {input: 'windowsTileIcon', style: 'windowsTileIconSmallScale'},
      ],
    },
  },
}
