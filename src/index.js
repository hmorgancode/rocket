'use strict';

import koa from 'koa';
import koaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import { graphqlKoa } from 'apollo-server-koa';

// const helmet = require('koa-helmet');
// const mongoose = require('mongoose');
import koaHelmet from 'koa-helmet';

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

app.use(koaHelmet());
app.use(koaBodyParser());

router.post()

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(PORT);

module.exports = app; // for tests
