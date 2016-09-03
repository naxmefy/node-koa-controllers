import koaCompose from 'koa-compose'
import * as _ from 'lodash'

export default class AppController {
  constructor () {
    this.init()
    this.afterInit()
  }

  init () {
    this._actionFilters = {}
    this.body = null
    this.autoBodyResponse = true
  }

  afterInit () {
  }

  get actionFilters () {
    return this._actionFilters
  }

  addFilter (actions, methods) {
    actions = _.isArray(actions) ? actions : [actions]
    methods = _.isArray(methods) ? methods : [methods]

    actions.forEach(action => {
      if (_.isArray(this.actionFilters[action]) === false) {
        this.actionFilters[action] = []
      }

      methods.forEach(method => {
        if (_.isString(method) === false) {
          this.actionFilters[action].push(method.bind(this))
        } else {
          this.actionFilters[action].push(this[method].bind(this))
        }
      })
    })
  }

  async automaticResponseOfState (ctx, next) {
    await next()
    if (this.autoBodyResponse !== false) {
      if (this.body instanceof Error) {
        ctx.throw(this.body)
      }

      // TODO: maybe enhance required
      ctx.body = this.body
    }
  }

  respond (o) {
    this.body = o
  }

  run (action) {
    action = _.isFunction(action) ? action.name : action
    return koaCompose([
      // async function (ctx, next) {
      //   ctx.action = action
      //   ctx.actionName = `${_.findKey(ctx.app.context.controllers, this)}.${action}`
      //   await next()
      // },
      this.automaticResponseOfState.bind(this),
      koaCompose(this.actionFilters[action] || []),
      this[action].bind(this)
    ])
  }
}
