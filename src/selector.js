const {isAbsolute, resolveUrl} = require('./url.js')
const {renderSize} = require('./size.js')

module.exports = {
  selectAbsoluteOutputUrl,
  selectAbsoluteStartUrl,
  selectAppleTouchStartupMedia,
  selectDescription,
  selectDeterminer,
  selectFacebookAppId,
  selectIosStatusBarStyle,
  selectIosStatusBarStyleIsNotDefault,
  selectLanguage,
  selectLocale,
  selectMaskColor,
  selectName,
  selectOutputHeight,
  selectOutputHtmlSizes,
  selectOutputType,
  selectOutputUrl,
  selectOutputWidth,
  selectPrimaryIosApp,
  selectPrimaryIosAppBannerString,
  selectPrimaryIosAppCountry,
  selectPrimaryIosAppId,
  selectPrimaryIosAppLaunchUrl,
  selectPrimaryPlayApp,
  selectPrimaryPlayAppId,
  selectPrimaryPlayAppLaunchUrl,
  selectPrimaryWindowsApp,
  selectPrimaryWindowsAppId,
  selectPrimaryWindowsAppLaunchUrl,
  selectThemeColor,
  selectTileColor,
  selectTwitterCardType,
  selectTwitterCardTypeIsApp,
  selectTwitterCardTypeIsSummary,
  selectTwitterCreatorHandle,
  selectTwitterDescription,
  selectTwitterSiteHandle,
  selectViewport,
}

function selectAbsoluteOutputUrl ({manifest, output}) {
  const {base} = manifest.urls
  const url = base ? resolveUrl(base, output.url) : output.url

  return isAbsolute(url) ? url : undefined
}

function selectAbsoluteStartUrl ({manifest}) {
  const {base, start} = manifest.urls
  const url = base ? resolveUrl(base, start) : start

  return isAbsolute(url) ? url : undefined
}

function selectAppleTouchStartupMedia ({output}) {
  return renderSize(
    '(device-width: [deviceWidth]px) and ' +
    '(device-height: [deviceHeight]px) and ' +
    '(-webkit-device-pixel-ratio: [pixelRatio]) and ' +
    '(orientation: [orientation])',
    output.size
  )
}

function selectDescription ({manifest}) {
  return manifest.description
}

function selectDeterminer ({manifest}) {
  return manifest.determiner
}

function selectFacebookAppId ({manifest}) {
  return manifest.applications.web.facebook.appId
}

function selectIosStatusBarStyle ({manifest}) {
  return manifest.os.ios.statusBarStyle
}

function selectIosStatusBarStyleIsNotDefault ({manifest}) {
  return manifest.os.ios.statusBarStyle !== 'default'
}

function selectLanguage ({manifest}) {
  return manifest.language
}

function selectLocale ({manifest}) {
  return manifest.language.replace('-', '_')
}

function selectMaskColor ({manifest}) {
  return manifest.color.mask
}

function selectName ({manifest}) {
  return manifest.name
}
function selectOutputHeight ({output}) {
  return output.size.height
}

function selectOutputHtmlSizes ({output}) {
  return output.htmlSizes
}

function selectOutputType ({output}) {
  return output.type
}

function selectOutputUrl ({output}) {
  return output.url
}

function selectOutputWidth ({output}) {
  return output.size.width
}

function selectPrimaryIosApp ({manifest}) {
  return manifest.applications.native.find(({platform}) => platform === 'itunes')
}

function selectPrimaryIosAppBannerString (definitions) {
  const id = selectPrimaryIosAppId(definitions)
  const url = selectPrimaryIosAppLaunchUrl(definitions)

  if (!id) return undefined

  return url ? `app-id=${id}, app-argument=${url}` : `app-id=${id}`
}

function selectPrimaryIosAppCountry (definitions) {
  const app = selectPrimaryIosApp(definitions)

  return app && app.country
}

function selectPrimaryIosAppId (definitions) {
  const app = selectPrimaryIosApp(definitions)

  return app && app.id
}

function selectPrimaryIosAppLaunchUrl (definitions) {
  const {manifest: {urls: {base}}} = definitions
  const app = selectPrimaryIosApp(definitions)

  return app && resolveUrl(base, app.launchUrl)
}

function selectPrimaryPlayApp ({manifest}) {
  return manifest.applications.native.find(({platform}) => platform === 'play')
}

function selectPrimaryPlayAppId (definitions) {
  const app = selectPrimaryPlayApp(definitions)

  return app && app.id
}

function selectPrimaryPlayAppLaunchUrl (definitions) {
  const {manifest: {urls: {base}}} = definitions
  const app = selectPrimaryPlayApp(definitions)

  return app && resolveUrl(base, app.launchUrl)
}

function selectPrimaryWindowsApp ({manifest}) {
  return manifest.applications.native.find(({platform}) => platform === 'windows')
}

function selectPrimaryWindowsAppId (definitions) {
  const app = selectPrimaryWindowsApp(definitions)

  return app && app.id
}

function selectPrimaryWindowsAppLaunchUrl (definitions) {
  const {manifest: {urls: {base}}} = definitions
  const app = selectPrimaryWindowsApp(definitions)

  return app && resolveUrl(base, app.launchUrl)
}

function selectThemeColor ({manifest}) {
  return manifest.color.theme
}

function selectTileColor ({manifest}) {
  return manifest.color.tile
}

function selectTwitterCardType ({manifest}) {
  return manifest.applications.web.twitter.cardType
}

function selectTwitterCardTypeIsApp ({manifest}) {
  return manifest.applications.web.twitter.cardType === 'app'
}

function selectTwitterCardTypeIsSummary ({manifest}) {
  return manifest.applications.web.twitter.cardType.startsWith('summary')
}

function selectTwitterCreatorHandle ({manifest}) {
  const {creatorHandle} = manifest.applications.web.twitter

  return creatorHandle && `@${creatorHandle}`
}

function selectTwitterDescription ({manifest}) {
  const {description} = manifest

  if (!description || description.length <= 200) return description

  return `${description.substring(0, 197)}...`
}

function selectTwitterSiteHandle ({manifest}) {
  const {siteHandle} = manifest.applications.web.twitter

  return siteHandle && `@${siteHandle}`
}

function selectViewport ({manifest}) {
  return manifest.viewport
}
