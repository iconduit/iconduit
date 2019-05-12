const {join} = require('path')
const {readFileSync} = require('fs')

const {normalize} = require('./config.js')
const {selectOutputs} = require('./output.js')

const config = normalize(JSON.parse(readFileSync(join(__dirname, '../test/fixture/iconduit.json'))))
const outputs = selectOutputs(config)

console.log(JSON.stringify(Array.from(outputs), null, 2))
