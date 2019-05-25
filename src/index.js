const {services} = require('./services.js')

module.exports = {
  buildConfigs,
}

async function buildConfigs (...buildPaths) {
  return services.buildConfigs(...buildPaths)
}
