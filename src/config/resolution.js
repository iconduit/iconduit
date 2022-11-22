export function resolveColors(config) {
  const {
    colors,
    definitions: { color },
  } = config;

  const resolved = {};

  for (const colorType in colors) {
    const name = colors[colorType];
    const definition = color[name];

    resolved[colorType] = definition || name;
  }

  return resolved;
}
