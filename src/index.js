const {join} = require('path')
const {readFileSync} = require('fs')

const {normalize} = require('./config.js')

const config = normalize(JSON.parse(readFileSync(join(__dirname, '../test/fixture/iconduit.json'))))

console.log(JSON.stringify(config, null, 2))
