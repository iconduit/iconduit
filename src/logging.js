import winston from 'winston'

import {DEFAULT_LOG_LEVEL} from './constant.js'

export function createLogger (env) {
  const {LOG_LEVEL: level = DEFAULT_LOG_LEVEL} = env

  return winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    transports: [new winston.transports.Console({level})],
  })
}

export function formatList (list) {
  const {length} = list

  if (!length) throw new Error('Invalid list')
  if (length < 2) return list[0]

  return list.slice(0, -1).join(', ') + ', and ' + list[length - 1]
}
