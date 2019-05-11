const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const sinonChai = require('sinon-chai')

chai.use(dirtyChai)
chai.use(sinonChai)
chai.use(chaiAsPromised)
