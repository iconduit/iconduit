import mime from "mime";
import { extname } from "path";

export function getType(filename) {
  const result = mime.getType(filename);

  if (result) return result;

  switch (extname(filename)) {
    case ".icns":
      return "image/icns";

    case ".iconduitmanifest":
      return "application/vnd.iconduit.manifest";
  }

  throw new Error(`Unable to determine MIME type for ${filename}`);
}
