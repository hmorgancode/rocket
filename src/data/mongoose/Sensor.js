'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Sensor = new Schema({
  type: { type: String, required: true, enum: ['Moisture', 'Water Level', 'DHT22'] },
  board: { type: ObjectId, required: true },
  dataPin: { type: Number, required: true, min: 0 },
  powerPin: Number,
  data: [{
          date: { type: Date, required: true, default: () => new Date() },
          // between 0 and 1024 as a fraction of input voltage.
          reading: { type: Number, min: 0, max: 1023 },
          temperature: Number,
          humidity: { type: Number, min: 0 }
        }]
});

export default mongoose.model('Sensor', Sensor);
