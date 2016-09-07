import * as _ from 'lodash'
import AppController from './app-controller'

export default class ResourceController extends AppController {
  init () {
    super.init()
    this.addFilter(['show', 'update', 'destroy'], 'setDocument')
    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
    this.show = this.show.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.setDocument = this.setDocument.bind(this);
  }

  afterInit () {
    super.afterInit()
    if(this.Model == null) {
      throw new Error('Model for ResourceController not defined')
    }
  }

  async index () {
    this.body = await this.Model.find()
  }

  async create (ctx) {
    const document = new this.Model(ctx.request.body)
    this.body = await document.save()
            .catch(error => {
              error.status = 400
              return error
            })
  }

  async show (ctx) {
    this.body = ctx.request.document
  }

  async update (ctx) {
    // TODO: maybe we need here another update procedure
    _.merge(ctx.request.document, ctx.request.body)
    this.body = await ctx.request.document.save()
            .catch(error => {
              error.status = 400
              return error
            })
  }

  async destroy (ctx) {
    this.body = await ctx.request.document.remove()
  }

  async setDocument (ctx, next) {
    ctx.request.document = await this.Model
      .findOne({_id: ctx.params.id})
    if (ctx.request.document) await next()
  }
}
