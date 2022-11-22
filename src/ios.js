export function buildIosAppIconContents(consumer) {
  const contents = {};

  add(contents, "images", buildImages(consumer));
  add(contents, "info", {
    version: 1,
    author: "iconduit",
  });

  return contents;
}

function buildImages(consumer) {
  const {
    output: {
      image: { iosAppIcon = {} },
    },
  } = consumer.manifest;

  const images = [];

  // sort like XCode does - ascending by device-independent size and pixel ratio
  const entries = Object.entries(iosAppIcon).sort(
    ([, { size: a }], [, { size: b }]) => {
      const aDipWidth = a.width / a.pixelRatio;
      const aDipHeight = a.height / a.pixelRatio;
      const bDipWidth = b.width / b.pixelRatio;
      const bDipHeight = b.height / b.pixelRatio;

      if (aDipWidth < bDipWidth) return -1;
      if (aDipWidth > bDipWidth) return 1;
      if (aDipHeight < bDipHeight) return -1;
      if (aDipHeight > bDipHeight) return 1;
      if (a.pixelRatio < b.pixelRatio) return -1;
      if (a.pixelRatio > b.pixelRatio) return 1;

      return 0;
    }
  );

  for (const [key, entry] of entries) {
    const {
      size: { width, height, pixelRatio },
    } = entry;

    const image = {};

    add(image, "idiom", "universal");
    add(image, "platform", "ios");
    add(image, "filename", consumer.imageUrl("iosAppIcon", key));
    add(image, "size", `${width / pixelRatio}x${height / pixelRatio}`);
    addNonDefault(image, "scale", `${pixelRatio}x`, "1x");

    images.push(image);
  }

  return images;
}

function add(object, property, value) {
  object[property] = value;
}

function addNonDefault(object, property, value, defaultValue) {
  if (value !== defaultValue) object[property] = value;
}
