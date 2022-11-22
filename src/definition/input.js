import {
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_STRATEGY_SVG_TRANSFORM,
} from "../constant.js";

export default {
  androidLauncherIconBackground: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconBackground",
    },
  },
  androidLauncherIconForeground: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconForeground",
    },
  },
  appleTouchIcon: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconFlatMaskable", style: "appleTouchIconScale" }],
    },
  },
  appleTouchStartup: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [
        { input: "backgroundColor" },
        { input: "iconSilhouette", style: "opacity10Percent" },
      ],
    },
  },
  facebookAppIcon: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconMaskableNoPadding",
    },
  },
  favicon: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconMaskedNoPadding",
    },
  },
  faviconIco: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "favicon",
    },
  },
  faviconPng: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "favicon",
    },
  },
  githubAccountIcon: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconMaskableNoPadding",
    },
  },
  iconBackground: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "backgroundColor",
    },
  },
  iconBleed: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "transparent",
    },
  },
  iconFlat: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "icon",
    },
  },
  iconFlatBackground: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconBackground",
    },
  },
  iconFlatBleed: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconBleed",
    },
  },
  iconFlatForeground: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconFlatBleed" }, { input: "iconFlat" }],
    },
  },
  iconFlatMaskable: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [
        { input: "iconFlatBackground" },
        { input: "iconFlatForeground" },
      ],
    },
  },
  iconFlatMasked: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      isMasked: true,
      layers: [
        { input: "iconFlatBackground" },
        { input: "iconFlatForeground" },
      ],
    },
  },
  iconForeground: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconBleed" }, { input: "icon" }],
    },
  },
  iconMask: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconMaskAndroidCircle",
    },
  },
  iconMaskable: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconBackground" }, { input: "iconForeground" }],
    },
  },
  iconMaskableNoPadding: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconMaskable", style: "noPaddingIconScale" }],
    },
  },
  iconMasked: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      isMasked: true,
      layers: [{ input: "iconBackground" }, { input: "iconForeground" }],
    },
  },
  iconMaskedNoPadding: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconMasked", style: "noPaddingIconScale" }],
    },
  },
  iconSilhouette: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconFlat",
    },
  },
  iosAppIcon: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "appleTouchIcon",
    },
  },
  macosIcns: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconFlatMasked", style: "macosIconScale" }],
    },
  },
  notificationBadge: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconSilhouette", style: "notificationBadgeScale" }],
    },
  },
  notificationIcon: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconMaskedNoPadding",
    },
  },
  openGraphImage: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "socialShareImage",
    },
  },
  safariMaskIcon: {
    strategy: INPUT_STRATEGY_SVG_TRANSFORM,
    options: {
      input: "iconSilhouette",
      style: "safariMaskIconScale",
      maskColor: "brand",
    },
  },
  socialShareImage: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "backgroundColor" }, { input: "iconSilhouette" }],
    },
  },
  twitterCardImage: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "socialShareImage",
    },
  },
  webAppIconMaskable: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconMaskable", style: "webAppIconMaskableScale" }],
    },
  },
  webAppIconMasked: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "iconMasked", style: "webAppIconMaskedScale" }],
    },
  },
  windowsIco: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconMaskedNoPadding",
    },
  },
  windowsTileIcon: {
    strategy: INPUT_STRATEGY_DEGRADE,
    options: {
      to: "iconSilhouette",
    },
  },
  windowsTileLarge: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "windowsTileIcon", style: "windowsTileIconScale" }],
    },
  },
  windowsTileMedium: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "windowsTileIcon", style: "windowsTileIconScale" }],
    },
  },
  windowsTileSmall: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [
        { input: "windowsTileIcon", style: "windowsTileIconSmallScale" },
      ],
    },
  },
  windowsTileWide: {
    strategy: INPUT_STRATEGY_COMPOSITE,
    options: {
      layers: [{ input: "windowsTileIcon", style: "windowsTileIconScale" }],
    },
  },
};
