# node-koa-controllers

[![npm version](https://badge.fury.io/js/%40naxmefy%2Fkoa-controllers.svg)](https://badge.fury.io/js/%40naxmefy%2Fkoa-controllers)

[![Build Status](https://travis-ci.org/naxmefy/node-koa-controllers.svg?branch=master)](https://travis-ci.org/naxmefy/node-koa-controllers)
[![Coverage Status](https://coveralls.io/repos/github/naxmefy/node-koa-controllers/badge.svg?branch=master)](https://coveralls.io/github/naxmefy/node-koa-controllers?branch=master)

## Installation

```
$ npm install --save @naxmefy/koa-controllers
```

## Usage

```JavaScript
import * as Controllers from '@naxmefy/koa-controllers'

class MyKoaController extends Controllers.AppController {
  async myUsers (ctx) {
    this.body = yield ctx.db.findMyUsers()
  }

  async myUsersView (ctx) {
    ctx.state.users = yield ctx.db.findMyUsers()
    ctx.render('userListView')
  }
}
```
