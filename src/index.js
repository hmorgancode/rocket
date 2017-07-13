'use strict';

const Koa = require('koa');
const helmet = require('koa-helmet');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rocket');

const app = new Koa();
app.use(helmet());

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);

module.exports = app; // for tests
