'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const DigitalHumidityTemperatureSensor = new Schema({
  type: { type: String, default: 'DHT22' },
  board: { type: ObjectId, required: true },
  dataPin: { type: Number, required: true },
  powerPin: Number,
  data: [{
          date: { type: Date, required: true, default: () => new Date() },
          temperature: { type: Number, required: true },
          humidity: { type: Number, required: true }
        }]
});

module.exports = mongoose.model('DHTSensor', DigitalHumidityTemperatureSensor);
