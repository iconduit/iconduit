import services from "./services.js";

export async function buildConfigs(options, ...buildPaths) {
  return services.buildConfigs(options, ...buildPaths);
}
