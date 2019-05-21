module.exports = {
  buildWebAppManifest,
}

function buildWebAppManifest (manifest) {
  const {
    categories,
    color: {background: backgroundColor, theme: themeColor},
    description,
    displayMode,
    iarcRatingId,
    language,
    name,
    orientation,
    preferRelatedApplications,
    scope,
    shortName,
    textDirection,
  } = manifest

  const webManifest = {}
  const add = (property, value) => { webManifest[property] = value }
  const addNonDefault = (property, value, defaultValue) => { if (value !== defaultValue) webManifest[property] = value }
  const addNonEmpty = (property, value) => { if (value.length > 0) webManifest[property] = value }
  const addOptional = (property, value) => { if (value != null) webManifest[property] = value }

  addNonDefault('dir', textDirection, 'auto')
  addOptional('lang', language)
  add('name', name)
  addOptional('short_name', shortName)
  addOptional('description', description)
  addOptional('scope', scope)
  addNonEmpty('icons', buildWebAppManifestIcons(manifest))
  add('display', displayMode)
  addOptional('orientation', orientation)
  addOptional('serviceworker', buildWebAppManifestServiceWorker(manifest))
  add('theme_color', themeColor)

  const applications = buildWebAppManifestRelatedApplications(manifest)

  if (applications.length > 0) {
    add('related_applications', applications)
    addOptional('prefer_related_applications', preferRelatedApplications)
  }

  add('background_color', backgroundColor)
  addNonEmpty('categories', categories)
  addOptional('iarc_rating_id', iarcRatingId)

  return webManifest
}

function buildWebAppManifestIcons (manifest) {
  const icons = []

  return icons
}

function buildWebAppManifestServiceWorker (manifest) {
  const serviceWorker = null

  return serviceWorker
}

function buildWebAppManifestRelatedApplications (manifest) {
  const applications = []

  return applications
}
