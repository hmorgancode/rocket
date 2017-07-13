'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnalogSensor = new Schema({
  sensorType: { type: String, required: true },
  board: { type: ObjectId, required: true, index: true },
  dataPin: { type: Number, required: true },
  powerPin: Number,
  data: [{
          date: { type: Date, required: true },
          reading: { type: Number, required: true } // between 0 and 1024 as a fraction of input voltage.
        }]
});

module.exports = AnalogSensor;
