import Koa from 'koa'
import KoaRouter from 'koa-router'
import supertest from 'supertest'
import {AppController} from '../src'

class SubController extends AppController {
  init() {
    super.init()

    this.beforeTest = this.beforeTest.bind(this)

    this.addFilter('test', this.beforeTest)

    this.test = this.run(this.test)
    this.error = this.run(this.error)
  }

  async beforeTest (ctx, next) {
    ctx.request.testLabel = 'test'
    await next()
  }

  async test (ctx) {
    this.body = ctx.request.testLabel
  }

  async error () {
    const err = new Error('rofl')
    err.status = 418
    this.body = err
  }
}

const app = new Koa()
const router = new KoaRouter()
const cInstance = new SubController()

router.get('/test', cInstance.test)
router.get('/error', cInstance.error)
app.use(router.routes(), router.allowedMethods())

const request = supertest(app.listen())

describe('KoaControllers: AppController', function () {
  // Most lines covered by koa-router.spec

  it('should be able to define a filter with a function', function * () {
    const response = yield request.get('/test')
    response.status.should.be.eql(200)
    response.text.should.be.eql('test')
  })

  it('should response 418 error if body contains an error', function * () {
    const response = yield request.get('/error')
    response.status.should.be.eql(418)
  })
})

