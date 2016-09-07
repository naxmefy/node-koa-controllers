import * as _ from 'lodash'
import AppController from './app-controller'

export default class ResourceController extends AppController {
  init () {
    super.init()

    this.setDocument = this.setDocument.bind(this);

    this.addFilter(['show', 'update', 'destroy'], this.setDocument)

    this.index = this.run(this.index);
    this.create = this.run(this.create);
    this.show = this.run(this.show);
    this.update = this.run(this.update);
    this.destroy = this.run(this.destroy);


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
