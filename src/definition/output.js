import { buildIosAppIconContents } from "../ios.js";
import { buildWebAppManifest } from "../web-app.js";

export default {
  androidLauncherIconBackground: {
    name: "android-launcher-icon-background.png",
    sizes: ["androidLauncherIcon"],
  },
  androidLauncherIconForeground: {
    name: "android-launcher-icon-foreground.png",
    sizes: ["androidLauncherIcon"],
  },
  appleTouchIcon: {
    name: "apple-touch-icon-[dimensions].png",
    options: {
      isTransparent: false,
    },
    sizes: ["appleTouchIconRetina"],
    tags: ["appleTouchIcon"],
  },
  appleTouchStartup: {
    name: "apple-touch-startup-[dimensions]r[pixelRatio].png",
    options: {
      isTransparent: false,
    },
    sizes: [
      "display.ipad1488x2266d326.landscape",
      "display.ipad1488x2266d326.portrait",
      "display.ipad1536x2048d326.landscape",
      "display.ipad1536x2048d326.portrait",
      "display.ipad1620x2160d264.landscape",
      "display.ipad1620x2160d264.portrait",
      "display.ipad1640x2360d264.landscape",
      "display.ipad1640x2360d264.portrait",
      "display.ipad1668x2224d264.landscape",
      "display.ipad1668x2224d264.portrait",
      "display.ipad1668x2388d264.landscape",
      "display.ipad1668x2388d264.portrait",
      "display.ipad2048x2732d264.landscape",
      "display.ipad2048x2732d264.portrait",
      "display.iphone1080x2340d476.landscape",
      "display.iphone1080x2340d476.portrait",
      "display.iphone1125x2436d458.landscape",
      "display.iphone1125x2436d458.portrait",
      "display.iphone1170x2532d460.landscape",
      "display.iphone1170x2532d460.portrait",
      "display.iphone1179x2556d460.landscape",
      "display.iphone1179x2556d460.portrait",
      "display.iphone1206x2622d460.landscape",
      "display.iphone1206x2622d460.portrait",
      "display.iphone1242x2688d458.landscape",
      "display.iphone1242x2688d458.portrait",
      "display.iphone1260x2736d460.landscape",
      "display.iphone1260x2736d460.portrait",
      "display.iphone1284x2778d458.landscape",
      "display.iphone1284x2778d458.portrait",
      "display.iphone1290x2796d460.landscape",
      "display.iphone1290x2796d460.portrait",
      "display.iphone1320x2868d460.landscape",
      "display.iphone1320x2868d460.portrait",
      "display.iphone750x1334d326.landscape",
      "display.iphone750x1334d326.portrait",
      "display.iphone828x1792d326.landscape",
      "display.iphone828x1792d326.portrait",
    ],
    tags: ["appleTouchStartup"],
  },
  browserconfigXml: {
    name: "browserconfig.xml",
    tags: ["msapplicationConfig"],
  },
  dmgBackground: {
    name: "dmg-background[atPixelRatioX].png",
    options: {
      isTransparent: false,
    },
    sizes: ["dmgBackground@2x", "dmgBackground"],
  },
  facebookAppIcon: {
    name: "facebook-app-icon.png",
    options: {
      isTransparent: false,
    },
    sizes: ["facebookAppIcon"],
  },
  githubAccountIcon: {
    name: "github-account-icon.png",
    sizes: ["githubAccountIcon"],
  },
  faviconIco: {
    name: "favicon.ico",
    sizes: ["faviconLarge", "faviconMedium", "faviconSmall"],
  },
  faviconPng: {
    name: "favicon-[dimensions].png",
    sizes: ["faviconMedium", "faviconSmall"],
    tags: ["icon"],
  },
  iconduitConsumerCjs: {
    name: "iconduit.consumer.cjs",
  },
  iconduitConsumerMjs: {
    name: "iconduit.consumer.mjs",
  },
  iconduitManifest: {
    name: "site.iconduitmanifest",
  },
  indexHtml: {
    name: "index.html",
  },
  iosAppIcon: {
    name: "AppIcon.appiconset/[dipDimensions][atPixelRatioX].png",
    sizes: [
      "iosAppIcon20@2x",
      "iosAppIcon20@3x",
      "iosAppIcon29@2x",
      "iosAppIcon29@3x",
      "iosAppIcon38@2x",
      "iosAppIcon38@3x",
      "iosAppIcon40@2x",
      "iosAppIcon40@3x",
      "iosAppIcon60@2x",
      "iosAppIcon60@3x",
      "iosAppIcon64@2x",
      "iosAppIcon64@3x",
      "iosAppIcon68@2x",
      "iosAppIcon76@2x",
      "iosAppIcon83Point5@2x",
      "iosAppIcon1024",
    ],
  },
  iosAppIconContents: {
    name: "AppIcon.appiconset/Contents.json",
    options: {
      variables: { buildIosAppIconContents },
    },
  },
  macosIcns: {
    name: "macos.icns",
    sizes: [
      "icns512@2x",
      "icns512",
      "icns256@2x",
      "icns256",
      "icns128@2x",
      "icns128",
      "icns32@2x",
      "icns32",
      "icns16@2x",
      "icns16",
    ],
  },
  notificationBadge: {
    name: "notification-badge.png",
    sizes: ["notificationBadge"],
  },
  notificationIcon: {
    name: "notification-icon.png",
    sizes: ["notificationIcon"],
  },
  openGraphImage: {
    name: "open-graph.png",
    options: {
      isTransparent: false,
    },
    sizes: ["openGraphImage"],
    tags: ["openGraphImage"],
  },
  safariMaskIcon: {
    name: "safari-mask-icon.svg",
    tags: ["maskIcon"],
  },
  serviceWorker: {
    name: "service-worker.js",
  },
  tagsHtml: {
    name: "tags.html",
  },
  twitterCardImage: {
    name: "twitter-card.png",
    options: {
      isTransparent: false,
    },
    sizes: ["twitterCardImage"],
    tags: ["twitterImage"],
  },
  webAppIconMaskable: {
    name: "web-app-icon-maskable-[dimensions].png",
    sizes: ["webAppIconLarge", "webAppIconMedium", "webAppIconSmall"],
  },
  webAppIconMasked: {
    name: "web-app-icon-masked-[dimensions].png",
    sizes: ["webAppIconLarge", "webAppIconMedium", "webAppIconSmall"],
  },
  webAppManifest: {
    name: "site.webmanifest",
    options: {
      variables: { buildWebAppManifest },
    },
    tags: ["manifest"],
  },
  windowsIco: {
    name: "windows.ico",
    sizes: [
      "windowsIco256",
      "windowsIco128",
      "windowsIco96",
      "windowsIco64",
      "windowsIco48",
      "windowsIco40",
      "windowsIco32",
      "windowsIco24",
      "windowsIco22",
      "windowsIco16",
    ],
  },
  windowsTileLarge: {
    name: "windows-tile-[dimensions].png",
    sizes: ["windowsTileLarge@2x"],
  },
  windowsTileMedium: {
    name: "windows-tile-[dimensions].png",
    sizes: ["windowsTileMedium@2x"],
    tags: ["msapplicationTileImage"],
  },
  windowsTileSmall: {
    name: "windows-tile-[dimensions].png",
    sizes: ["windowsTileSmall@2x"],
  },
  windowsTileWide: {
    name: "windows-tile-[dimensions].png",
    sizes: ["windowsTileWide@2x"],
  },
};
