const {join} = require('path')
const {readFileSync} = require('fs')

const {buildOutput} = require('./build.js')
const {createContext} = require('./context.js')
const {normalize} = require('./config.js')

async function main () {
  const config = normalize(JSON.parse(readFileSync(join(__dirname, '../test/fixture/iconduit.json'))))
  const context = await createContext(config)
  const {outputs} = context

  const threads = Object.entries(outputs).map(async ([name, output]) => buildOutput(context, name, output))

  await Promise.all(threads)
}

main().catch(({stack}) => {
  console.error(stack)
  process.exit(1)
})
