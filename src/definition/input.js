module.exports = {
  'apple-touch-icon': {
    strategy: 'composite',
    options: {
      mask: null,
      layers: [
        {input: 'icon-foreground', style: 'apple-touch-icon-scale'},
        {input: 'icon-background', style: 'apple-touch-icon-scale'},
      ],
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
        {input: 'icon'},
        {input: 'icon-bleed'},
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
        {input: 'icon-foreground'},
        {input: 'icon-background'},
      ],
    },
  },
  'masked-icon': {
    strategy: 'composite',
    options: {
      mask: 'icon-mask',
      layers: [
        {input: 'icon-foreground'},
        {input: 'icon-background'},
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
        {input: 'icon-silhouette', style: 'social-share-icon-scale'},
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
        {input: 'windows-tile-icon', style: 'windows-tile-icon-position'},
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
