'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const DigitalHumidityTemperatureSensor = new Schema({
  type: { type: String, default: 'DHT22', trim: true },
  board: { type: ObjectId, required: true },
  dataPin: { type: Number, required: true, min: 0 },
  powerPin: Number,
  data: [{
          date: { type: Date, required: true, default: () => new Date() },
          temperature: { type: Number, required: true },
          humidity: { type: Number, required: true, min: 0 }
        }]
});

export default mongoose.model('DHTSensor', DigitalHumidityTemperatureSensor);
