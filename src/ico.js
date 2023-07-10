const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;

export function toIco(logger, entries) {
  const ico = Buffer.alloc(
    entries.reduce(
      (total, { content: { length } }) => total + length + ICONDIRENTRY_SIZE,
      ICONDIR_SIZE,
    ),
  );

  // ICONDIR
  ico.writeUInt16LE(0, 0); // reserved as 0
  ico.writeUInt16LE(1, 2); // image type 1 (.ico)
  ico.writeUInt16LE(entries.length, 4); // image count

  let headerOffset = ICONDIR_SIZE;
  let imageOffset = ICONDIR_SIZE + ICONDIRENTRY_SIZE * entries.length;

  entries.sort(
    ({ content: { length: a } }, { content: { length: b } }) => a - b,
  );

  for (const {
    content,
    size: { width, height },
  } of entries) {
    logger.debug(`Adding ICO entry for ${width}x${height}`);

    // ICONDIRENTRY
    ico.writeUInt8(safeDimension(width), 0 + headerOffset); // pixel width
    ico.writeUInt8(safeDimension(height), 1 + headerOffset); // pixel height
    ico.writeUInt8(0, 2 + headerOffset); // palette size 0 (no palette)
    ico.writeUInt8(0, 3 + headerOffset); // reserved as 0
    ico.writeUInt16LE(1, 4 + headerOffset); // color planes 1 (known good value)
    ico.writeUInt16LE(32, 6 + headerOffset); // 32 bits per pixel (true color RGBA, with 8 bits per channel)
    ico.writeUInt32LE(content.length, 8 + headerOffset); // byte size
    ico.writeUInt32LE(imageOffset, 12 + headerOffset); // offset from start of file

    content.copy(ico, imageOffset);

    headerOffset += ICONDIRENTRY_SIZE;
    imageOffset += content.length;
  }

  return ico;
}

function safeDimension(dimension) {
  if (dimension < 256) return dimension;
  if (dimension === 256) return 0;

  throw new Error(`Invalid ICO image dimension: ${dimension}`);
}
