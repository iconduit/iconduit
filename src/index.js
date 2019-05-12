const {join} = require('path')
const {readFileSync} = require('fs')

const {buildOutput} = require('./build.js')
const {createContext} = require('./context.js')
const {createLogger} = require('./logging.js')
const {normalize} = require('./config.js')

async function main (services) {
  const config = normalize(JSON.parse(readFileSync(join(__dirname, '../test/fixture/iconduit.json'))))
  const context = await createContext(services, config)
  const {outputs} = context

  const threads = Object.entries(outputs).map(async ([name, output]) => buildOutput(context, name, output))

  await Promise.all(threads)
}

const {env, exit} = process
const logger = createLogger(env)
const services = {logger}

main(services).catch(({stack}) => {
  logger.error(stack)
  exit(1)
})
