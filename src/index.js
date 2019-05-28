const {services} = require('./services.js')

module.exports = {
  buildConfigs,
}

async function buildConfigs (options, ...buildPaths) {
  return services.buildConfigs(options, ...buildPaths)
}
