module.exports = {
  selectManifestDescription,
  selectManifestLanguage,
  selectManifestMaskColor,
  selectManifestName,
  selectManifestThemeColor,
  selectOutputHeight,
  selectOutputHtmlSizes,
  selectOutputPath,
  selectOutputType,
  selectOutputWidth,
}

function selectManifestDescription ({manifest: {description}}) {
  return description
}

function selectManifestLanguage ({manifest: {language}}) {
  return language
}

function selectManifestMaskColor ({manifest: {color: {mask}}}) {
  return mask
}

function selectManifestName ({manifest: {name}}) {
  return name
}

function selectManifestThemeColor ({manifest: {color: {theme}}}) {
  return theme
}

function selectOutputHeight ({output: {size: {height}}}) {
  return height
}

function selectOutputHtmlSizes ({output: {htmlSizes}}) {
  return htmlSizes
}

function selectOutputPath ({output: {path}}) {
  return path
}

function selectOutputType ({output: {type}}) {
  return type
}

function selectOutputWidth ({output: {size: {width}}}) {
  return width
}
