'use strict';

import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost/test');

const AnalogSensor = require('./Schemas/AnalogSensor');
const DHTSensor = require('./Schemas/DHTSensor');
const Plant = require('./Schemas/Plant');
const Board = require('./Schemas/Board');

console.log('instantiating Board without required props...');
var instance = new Board();
// instance.location = 'Hallway';
instance.save((err) => err && console.log(err));
