const {join} = require('path')
const {readFileSync} = require('fs')

const {normalize} = require('./config.js')

console.log(normalize(JSON.parse(readFileSync(join(__dirname, '../test/fixture/iconduit.json')))))
