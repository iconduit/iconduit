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

  const icons = []
  const serviceWorker = null
  const relatedApplications = []
  const hasRelatedApplications = relatedApplications.length > 0

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
  addNonEmpty('icons', icons)
  add('display', displayMode)
  addOptional('orientation', orientation)
  addOptional('serviceworker', serviceWorker)
  add('theme_color', themeColor)
  if (hasRelatedApplications) {
    add('related_applications', relatedApplications)
    addOptional('prefer_related_applications', preferRelatedApplications)
  }
  add('background_color', backgroundColor)
  addNonEmpty('categories', categories)
  addOptional('iarc_rating_id', iarcRatingId)

  return webManifest
}
