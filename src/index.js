const {join} = require('path')
const {readFileSync} = require('fs')

const {build} = require('./build.js')
const {createLogger} = require('./logging.js')
const {normalize} = require('./config.js')

async function main (services) {
  const config = normalize(JSON.parse(readFileSync(join(__dirname, '../test/fixture/iconduit.json'))))

  await build(services, config)
}

const {env, exit} = process
const logger = createLogger(env)
const services = {logger}

main(services).catch(({stack}) => {
  logger.error(stack)
  exit(1)
})
