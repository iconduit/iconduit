/* eslint-disable no-template-curly-in-string */

const selectAbsoluteImageUrl = '<%- absoluteImageUrl(current.name, current.size) %>'
const selectAbsoluteStartUrl = '<%- absoluteUrl(manifest.urls.start) %>'
const selectDescription = '<%- manifest.description %>'
const selectDeterminer = '<%- manifest.determiner %>'
const selectDisplayModeIsStandaloneOrFullscreen = '<%- (mode => ["standalone", "fullscreen"].includes(mode))(manifest.displayMode) ? "true" : "" %>'
const selectFacebookAppId = '<%- manifest.applications.web.facebook.appId %>'
const selectIosStatusBarStyle = '<%- manifest.os.ios.statusBarStyle %>'
const selectIosStatusBarStyleIsNotDefault = '<%- manifest.os.ios.statusBarStyle !== "default" ? "true" : "" %>'
const selectLocale = '<%- manifest.language.replace("-", "_") %>'
const selectMaskColor = '<%- manifest.color.mask %>'
const selectName = '<%- manifest.name %>'
const selectOutputHeight = '<%- current.output.size.height %>'
const selectOutputHtmlSizes = '<%- current.output.htmlSizes %>'
const selectOutputType = '<%- current.output.type %>'
const selectOutputUrl = '<%- current.url() %>'
const selectOutputWidth = '<%- current.output.size.width %>'
const selectThemeColor = '<%- manifest.color.theme %>'
const selectTileColor = '<%- manifest.color.tile %>'
const selectTwitterCardType = '<%- manifest.applications.web.twitter.cardType %>'
const selectTwitterCardTypeIsApp = '<%- manifest.applications.web.twitter.cardType === "app" ? "true" : "" %>'
const selectTwitterCardTypeIsSummary = '<%- manifest.applications.web.twitter.cardType.startsWith("summary") ? "true" : "" %>'
const selectTwitterCreatorHandle = '<%- (handle => handle && `@${handle}`)(manifest.applications.web.twitter.creatorHandle) %>'
const selectTwitterDescription = '<%- (manifest.description || "").length <= 200 ? manifest.description : manifest.description.substring(197) + "..." %>'
const selectTwitterSiteHandle = '<%- (handle => handle && `@${handle}`)(manifest.applications.web.twitter.siteHandle) %>'
const selectViewport = '<%- manifest.viewport %>'

const selectAppleTouchStartupMedia =
  '(device-width: <%- current.output.size.deviceWidth %>px) and ' +
  '(device-height: <%- current.output.size.deviceHeight %>px) and ' +
  '(-webkit-device-pixel-ratio: <%- current.output.size.pixelRatio %>) and ' +
  '(orientation: <%- current.output.size.orientation %>)'

const findPrimaryIosApp = 'manifest.applications.native.find(({platform}) => platform === "itunes")'
const findPrimaryPlayApp = 'manifest.applications.native.find(({platform}) => platform === "play")'
const findPrimaryWindowsApp = 'manifest.applications.native.find(({platform}) => platform === "windows")'

const selectPrimaryIosApp = `<%- ${findPrimaryIosApp} ? "true" : "" %>`
const selectPrimaryIosAppCountry = `<%- (${findPrimaryIosApp} || {}).country %>`
const selectPrimaryIosAppId = `<%- (${findPrimaryIosApp} || {}).id %>`
const selectPrimaryIosAppLaunchUrl = `<%- (({launchUrl} = {}) => launchUrl && absoluteUrl(launchUrl))(${findPrimaryIosApp}) %>`
const selectPrimaryIosAppBannerString =
  '<%- (({id, launchUrl} = {}) => id && (' +
  'launchUrl ? `app-id=${id}, app-argument=${absoluteUrl(launchUrl)}` : `app-id=${id}`' +
  `))(${findPrimaryIosApp}) %>`

const selectPrimaryPlayApp = `<%- ${findPrimaryPlayApp} ? "true" : "" %>`
const selectPrimaryPlayAppId = `<%- (${findPrimaryPlayApp} || {}).id %>`
const selectPrimaryPlayAppLaunchUrl = `<%- (({launchUrl} = {}) => launchUrl && absoluteUrl(launchUrl))(${findPrimaryPlayApp}) %>`

const selectPrimaryWindowsApp = `<%- ${findPrimaryWindowsApp} ? "true" : "" %>`
const selectPrimaryWindowsAppId = `<%- (${findPrimaryWindowsApp} || {}).id %>`
const selectPrimaryWindowsAppLaunchUrl = `<%- (({launchUrl} = {}) => launchUrl && absoluteUrl(launchUrl))(${findPrimaryWindowsApp}) %>`

module.exports = {
  appleItunesApp: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          name: 'apple-itunes-app',
          content: selectPrimaryIosAppBannerString,
        },
        predicate: [
          selectPrimaryIosAppBannerString,
        ],
      },
    ],
  },
  appleMobile: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        sortWeight: 1000,
        predicate: [
          selectDisplayModeIsStandaloneOrFullscreen,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-title',
          content: selectName,
        },
        sortWeight: 2000,
      },
      {
        tag: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-status-bar-style',
          content: selectIosStatusBarStyle,
        },
        sortWeight: 5000,
        predicate: [
          selectIosStatusBarStyleIsNotDefault,
        ],
      },
    ],
  },
  appleTouchIcon: {
    icon: [
      {
        tag: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          href: selectOutputUrl,
        },
        sortWeight: -1,
      },
    ],
  },
  appleTouchStartup: {
    appleTouchStartup: [
      {
        tag: 'link',
        attributes: {
          rel: 'apple-touch-startup-image',
          href: selectOutputUrl,
          media: selectAppleTouchStartupMedia,
        },
      },
    ],
  },
  applicationName: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'application-name',
          content: selectName,
        },
        sortWeight: 2000,
      },
    ],
  },
  appLinks: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          property: 'al:android:url',
          content: selectPrimaryPlayAppLaunchUrl,
        },
        predicate: [
          selectPrimaryPlayAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:android:package',
          content: selectPrimaryPlayAppId,
        },
        predicate: [
          selectPrimaryPlayAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:android:app_name',
          content: selectName,
        },
        predicate: [
          selectPrimaryPlayApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:ios:url',
          content: selectPrimaryIosAppLaunchUrl,
        },
        predicate: [
          selectPrimaryIosAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:ios:app_store_id',
          content: selectPrimaryIosAppId,
        },
        predicate: [
          selectPrimaryIosAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:ios:app_name',
          content: selectName,
        },
        predicate: [
          selectPrimaryIosApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:web:url',
          content: selectAbsoluteStartUrl,
        },
        predicate: [
          selectAbsoluteStartUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:windows:url',
          content: selectPrimaryWindowsAppLaunchUrl,
        },
        predicate: [
          selectPrimaryWindowsAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:windows:package',
          content: selectPrimaryWindowsAppId,
        },
        predicate: [
          selectPrimaryWindowsAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'al:windows:app_name',
          content: selectName,
        },
        predicate: [
          selectPrimaryWindowsApp,
        ],
      },
    ],
  },
  description: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'description',
          content: selectDescription,
        },
        sortWeight: 3000,
      },
    ],
  },
  facebook: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          property: 'fb:app_id',
          content: selectFacebookAppId,
        },
        predicate: [
          selectFacebookAppId,
        ],
      },
    ],
  },
  icon: {
    icon: [
      {
        tag: 'link',
        attributes: {
          rel: 'icon',
          type: selectOutputType,
          href: selectOutputUrl,
          sizes: selectOutputHtmlSizes,
        },
      },
    ],
  },
  manifest: {
    link: [
      {
        tag: 'link',
        attributes: {
          rel: 'manifest',
          href: selectOutputUrl,
        },
      },
    ],
  },
  maskIcon: {
    icon: [
      {
        tag: 'link',
        attributes: {
          rel: 'mask-icon',
          href: selectOutputUrl,
          color: selectMaskColor,
        },
      },
    ],
  },
  mobileWebAppCapable: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'mobile-web-app-capable',
          content: 'yes',
        },
        sortWeight: 1000,
        predicate: [
          selectDisplayModeIsStandaloneOrFullscreen,
        ],
      },
    ],
  },
  msapplicationTileColor: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-TileColor',
          content: selectTileColor,
        },
        sortWeight: 6000,
      },
    ],
  },
  msapplicationTileImage: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-TileImage',
          content: selectOutputUrl,
        },
        sortWeight: 6100,
      },
    ],
  },
  msapplicationConfig: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'msapplication-config',
          content: selectOutputUrl,
        },
        sortWeight: 6200,
      },
    ],
  },
  openGraph: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          property: 'og:type',
          content: 'website',
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:locale',
          content: selectLocale,
        },
        predicate: [
          selectLocale,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:url',
          content: selectAbsoluteStartUrl,
        },
        predicate: [
          selectAbsoluteStartUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:site_name',
          content: selectName,
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:determiner',
          content: selectDeterminer,
        },
        predicate: [
          selectDeterminer,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:title',
          content: selectName,
        },
        predicate: [
          selectName,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:description',
          content: selectDescription,
        },
        predicate: [
          selectDescription,
        ],
      },
    ],
  },
  openGraphImage: {
    graphImage: [
      {
        tag: 'meta',
        attributes: {
          property: 'og:image',
          content: selectAbsoluteImageUrl,
        },
        predicate: [
          selectAbsoluteImageUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:type',
          content: selectOutputType,
        },
        predicate: [
          selectAbsoluteImageUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:width',
          content: selectOutputWidth,
        },
        predicate: [
          selectAbsoluteImageUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:height',
          content: selectOutputHeight,
        },
        predicate: [
          selectAbsoluteImageUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:alt',
          content: selectName,
        },
        predicate: [
          selectAbsoluteImageUrl,
        ],
      },
    ],
  },
  themeColor: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'theme-color',
          content: selectThemeColor,
        },
        sortWeight: 5000,
      },
    ],
  },
  twitter: {
    graph: [
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:card',
          content: selectTwitterCardType,
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:site',
          content: selectTwitterSiteHandle,
        },
        predicate: [
          selectTwitterSiteHandle,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:creator',
          content: selectTwitterCreatorHandle,
        },
        predicate: [
          selectTwitterCardTypeIsSummary,
          selectTwitterCreatorHandle,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:title',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsSummary,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:description',
          content: selectTwitterDescription,
        },
        predicate: [
          selectTwitterDescription,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:country',
          content: selectPrimaryIosAppCountry,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppCountry,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:name:iphone',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:id:iphone',
          content: selectPrimaryIosAppId,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:url:iphone',
          content: selectPrimaryIosAppLaunchUrl,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:name:ipad',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:id:ipad',
          content: selectPrimaryIosAppId,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:url:ipad',
          content: selectPrimaryIosAppLaunchUrl,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryIosAppLaunchUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:name:googleplay',
          content: selectName,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryPlayApp,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:id:googleplay',
          content: selectPrimaryPlayAppId,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryPlayAppId,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:app:url:googleplay',
          content: selectPrimaryPlayAppLaunchUrl,
        },
        predicate: [
          selectTwitterCardTypeIsApp,
          selectPrimaryPlayAppLaunchUrl,
        ],
      },
    ],
  },
  twitterImage: {
    graphImage: [
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image',
          content: selectAbsoluteImageUrl,
        },
        predicate: [
          selectAbsoluteImageUrl,
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image:alt',
          content: selectName,
        },
        predicate: [
          selectAbsoluteImageUrl,
        ],
      },
    ],
  },
  viewport: {
    meta: [
      {
        tag: 'meta',
        attributes: {
          name: 'viewport',
          content: selectViewport,
        },
        sortWeight: 4000,
      },
    ],
  },
}
