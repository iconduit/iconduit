const winston = require('winston')

const {DEFAULT_LOG_LEVEL} = require('./constant.js')

module.exports = {
  createLogger,
  formatList,
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

function formatList (list) {
  const {length} = list

  if (!length) throw new Error('Invalid list')
  if (length < 2) return list[0]

  return list.slice(0, -1).join(', ') + ', and ' + list[length - 1]
}
