module.exports = {
  selectDescription,
  selectFacebookAppId,
  selectLanguage,
  selectLocale,
  selectMaskColor,
  selectName,
  selectOpenGraphDeterminer,
  selectOutputHeight,
  selectOutputHtmlSizes,
  selectOutputPath,
  selectOutputType,
  selectOutputWidth,
  selectPrimaryIosApp,
  selectPrimaryIosAppCountry,
  selectPrimaryIosAppId,
  selectPrimaryIosAppLaunchUrl,
  selectPrimaryPlayApp,
  selectPrimaryPlayAppId,
  selectPrimaryPlayAppLaunchUrl,
  selectThemeColor,
  selectTwitterCardType,
  selectTwitterCardTypeIsApp,
  selectTwitterCardTypeIsSummary,
  selectTwitterCreatorHandle,
  selectTwitterDescription,
  selectTwitterSiteHandle,
  selectUrl,
  selectViewport,
}

function selectDescription ({manifest}) {
  return manifest.description
}

function selectFacebookAppId ({manifest}) {
  return manifest.applications.web.facebook.appId
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

function selectOpenGraphDeterminer ({manifest}) {
  return manifest.applications.web.openGraph.determiner
}

function selectOutputHeight ({output}) {
  return output.size.height
}

function selectOutputHtmlSizes ({output}) {
  return output.htmlSizes
}

function selectOutputPath ({output}) {
  return output.path
}

function selectOutputType ({output}) {
  return output.type
}

function selectOutputWidth ({output}) {
  return output.size.width
}

function selectPrimaryIosApp ({manifest}) {
  return manifest.applications.native.find(({platform}) => platform === 'itunes')
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
  const app = selectPrimaryIosApp(definitions)

  return app && app.launchUrl
}

function selectPrimaryPlayApp ({manifest}) {
  return manifest.applications.native.find(({platform}) => platform === 'play')
}

function selectPrimaryPlayAppId (definitions) {
  const app = selectPrimaryPlayApp(definitions)

  return app && app.id
}

function selectPrimaryPlayAppLaunchUrl (definitions) {
  const app = selectPrimaryPlayApp(definitions)

  return app && app.launchUrl
}

function selectThemeColor ({manifest}) {
  return manifest.color.theme
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

function selectUrl ({manifest}) {
  return manifest.url
}

function selectViewport ({manifest}) {
  return manifest.viewport
}
