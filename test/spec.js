import * as Controllers from '../src'

const tests = [
  'AppController',
  'ResourceController'
]

describe('KoaControllers', function () {
  tests.forEach(test => {
    it(`should have a ${test} property`, function () {
      Controllers.should.have.property(test)
    })
  })
})
