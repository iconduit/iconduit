export default {
  all: {
    outputs: ["iconduitConsumerCjs", "iconduitConsumerMjs", "iconduitManifest"],
  },
  browser: {
    all: {
      outputs: [
        "faviconIco",
        "faviconPng",
        "indexHtml",
        "notificationBadge",
        "notificationIcon",
        "serviceWorker",
        "tagsHtml",
        "webAppIconMaskable",
        "webAppIconMasked",
        "webAppManifest",
      ],
      tags: ["applicationName", "description", "themeColor", "viewport"],
    },
    and_chr: {
      tags: ["mobileWebAppCapable"],
    },
    edge: {
      outputs: [
        "browserconfigXml",
        "windowsTileLarge",
        "windowsTileMedium",
        "windowsTileSmall",
        "windowsTileWide",
      ],
      tags: ["msapplicationTileColor"],
    },
    ie: {
      outputs: [
        "browserconfigXml",
        "windowsTileLarge",
        "windowsTileMedium",
        "windowsTileSmall",
        "windowsTileWide",
      ],
      tags: ["msapplicationTileColor"],
    },
    ios_saf: {
      outputs: ["safariMaskIcon"],
      tags: ["appleItunesApp", "appleMobile"],
    },
    safari: {
      outputs: ["safariMaskIcon"],
    },
  },
  installer: {
    dmg: {
      outputs: ["dmgBackground"],
    },
  },
  os: {
    android: {
      outputs: [
        "androidLauncherIconBackground",
        "androidLauncherIconForeground",
      ],
    },
    ios: {
      outputs: [
        "appleTouchIcon",
        "appleTouchStartup",
        "iosAppIcon",
        "iosAppIconContents",
      ],
    },
    macos: {
      outputs: ["macosIcns"],
    },
    windows: {
      outputs: ["windowsIco"],
    },
  },
  web: {
    facebook: {
      outputs: ["facebookAppIcon", "openGraphImage"],
      tags: ["appLinks", "facebook", "openGraph"],
    },
    github: {
      outputs: ["githubAccountIcon"],
    },
    pinterest: {
      tags: ["appLinks"],
    },
    reddit: {
      outputs: ["openGraphImage"],
      tags: ["openGraph"],
    },
    twitter: {
      outputs: ["twitterCardImage"],
      tags: ["twitter"],
    },
  },
};
