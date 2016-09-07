import {ResourceController} from '../src'
import Promise from 'bluebird'
import * as _ from 'lodash'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaBodyparser from 'koa-bodyparser'
import supertest from 'supertest'

class ModelMock {
  constructor (attrs) {
    _.forEach(attrs, (v, k) => this[k] = v)
  }

  static find (attrs) {
    return new Promise((res) => {
      return res([new this(attrs)])
    })
  }

  static findOne (attrs) {
    return new Promise((res) => {
      return res(new this(attrs))
    })
  }

  save () {
    return new Promise((res) => {
      return res(this)
    })
  }

  remove () {
    return new Promise((res) => {
      return res(this)
    })
  }

  validateSync () {
    return void 0
  }
}
class ErrorModelMock extends ModelMock {
  save () {
    return new Promise((res, rej) => {
      return rej(new Error('just an error'))
    })
  }

  validateSync () {
    return void 0 //new Error('just an error')
  }
}

class ModelsController extends ResourceController {
  init () {
    super.init()
    this.Model = ModelMock
  }
}
class ErrorModelsController extends ResourceController {
  init () {
    super.init()
    this.Model = ErrorModelMock
  }
}
class NoModelController extends ResourceController {
}

const app = new Koa()
app.use(koaBodyparser())

const router = new KoaRouter()
const cInstance = new ModelsController()
const eInstance = new ErrorModelsController()

router.get('/models', cInstance.index)
router.post('/models', cInstance.create)
router.get('/models/1', cInstance.show)
router.put('/models/1', cInstance.update)
router.delete('/models/1', cInstance.destroy)

router.post('/errormodels', eInstance.create)
router.put('/errormodels/1', eInstance.update)
app.use(router.routes(), router.allowedMethods())

const request = supertest(app.listen())

describe('KoaControllers: ResourceController', function () {
  describe('instance', function () {
    it('should throw error if no Model is defined', function () {
      (() => new NoModelController()).should.throw()
    });
  });
  describe('request', function () {
    describe('GET /models', function () {
      it('should return status 200 and an array', function * () {
        const response = yield request.get('/models')

        response.status.should.be.eql(200)
        response.body.should.be.an.Array()
      })
    })

    describe('POST /models', function () {
      it('should return status 200 and an object with test: foobar', function * () {
        const response = yield request.post('/models')
          .send({test: 'foobar'})

        response.status.should.be.eql(200)
        response.body.should.be.an.Object()
        response.body.should.containEql({test: 'foobar'})
      })
    })

    describe('POST /errormodels', function () {
      it('should return status 400 and an error', function * () {
        const response = yield request.post('/errormodels')
          .send({test: 'foobar'})

        response.status.should.be.eql(400)
        response.text.should.be.eql('just an error')
      })
    })

    describe('GET /models/1', function () {
      it('should return 200 and an object', function * () {
        const response = yield request.get('/models/1')

        response.status.should.be.eql(200)
        response.body.should.be.an.Object()
      })
    })

    describe('PUT /models/1', function () {
      it('should return 200 and an object with test: foobar', function * () {
        const response = yield request.put('/models/1')
          .send({test: 'foobar'})

        response.status.should.be.eql(200)
        response.body.should.be.an.Object()
        response.body.should.containEql({test: 'foobar'})
      })
    })

    describe('PUT /errormodels/1', function () {
      it('should return status 400 and an error', function * () {
        const response = yield request.put('/errormodels/1')
          .send({test: 'foobar'})

        response.status.should.be.eql(400)
        response.text.should.be.eql('just an error')
      })
    })

    describe('DELETE /models/1', function () {
      it('should return 200 and an object', function * () {
        const response = yield request.delete('/models/1')

        response.status.should.be.eql(200)
        response.body.should.be.an.Object()
      })
    })
  });
})
