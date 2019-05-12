const winston = require('winston')

const DEFAULT_LOG_LEVEL = 'info'

module.exports = {
  createLogger,
}

function createLogger (env) {
  const {LOG_LEVEL: level = DEFAULT_LOG_LEVEL} = env

  return winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console({level})],
  })
}
