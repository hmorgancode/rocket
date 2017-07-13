'use strict';

const Koa = require('koa');
const helmet = require('koa-helmet');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rocket_test');

const AnalogSensor = require('./Schemas/AnalogSensor');
const DHTSensor = require('./Schemas/DHTSensor');
const Plant = require('./Schemas/Plant');
const Board = require('./Schemas/Board');

console.log('instantiating Board without required props...');
var instance = new Board();
// instance.location = 'Hallway';
instance.save((err) => err && console.log(err));

const app = new Koa();
app.use(helmet());

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);

module.exports = app; // for tests
