module.exports = {
  'apple-touch-icon': {
    strategy: 'composite',
    options: {
      mask: null,
      layers: [
        {input: 'icon', multiplier: 2, style: 'apple-touch-icon-scale'},
        {input: 'icon-background', multiplier: 2, style: 'apple-touch-icon-scale'},
      ],
    },
  },
  'facebook-app-icon': {
    strategy: 'degrade',
    options: {
      to: 'maskable-icon',
    },
  },
  'icon-background': {
    strategy: 'degrade',
    options: {
      to: 'background-color',
    },
  },
  'icon-bleed': {
    strategy: 'degrade',
    options: {
      to: 'transparent',
    },
  },
  'icon-foreground': {
    strategy: 'composite',
    options: {
      mask: null,
      layers: [
        {input: 'icon', multiplier: 1, style: null},
        {input: 'icon-bleed', multiplier: 1, style: null},
      ],
    },
  },
  'icon-mask': {
    strategy: 'degrade',
    options: {
      to: 'icon-mask-android-circle',
    },
  },
  'icon-silhouette': {
    strategy: 'degrade',
    options: {
      to: 'icon',
    },
  },
  'maskable-icon': {
    strategy: 'composite',
    options: {
      mask: null,
      layers: [
        {input: 'icon-foreground', multiplier: 1, style: null},
        {input: 'icon-background', multiplier: 1, style: null},
      ],
    },
  },
  'masked-icon': {
    strategy: 'composite',
    options: {
      mask: 'icon-mask',
      layers: [
        {input: 'icon-foreground', multiplier: 1, style: null},
        {input: 'icon-background', multiplier: 1, style: null},
      ],
    },
  },
  'open-graph-image': {
    strategy: 'degrade',
    options: {
      to: 'social-share-image',
    },
  },
  'safari-mask-icon': {
    strategy: 'degrade',
    options: {
      to: 'icon-silhouette',
    },
  },
  'social-share-image': {
    strategy: 'composite',
    options: {
      mask: null,
      layers: [
        {input: 'icon-silhouette', multiplier: 1, style: 'social-share-icon-scale'},
      ],
    },
  },
  'twitter-card-image': {
    strategy: 'degrade',
    options: {
      to: 'social-share-image',
    },
  },
  'windows-tile': {
    strategy: 'composite',
    options: {
      mask: null,
      layers: [
        {input: 'windows-tile-icon', multiplier: 1, style: 'windows-tile-icon-position'},
      ],
    },
  },
  'windows-tile-icon': {
    strategy: 'degrade',
    options: {
      to: 'icon-silhouette',
    },
  },
}
