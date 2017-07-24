'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnalogSensor = new Schema({
  type: { type: String, required: true, trim: true },
  board: { type: ObjectId, required: true },
  dataPin: { type: Number, required: true, min: 0 },
  powerPin: Number,
  data: [{
          date: { type: Date, required: true, default: () => new Date() },
          reading: { type: Number, required: true, min: 0, max: 1023 } // between 0 and 1024 as a fraction of input voltage.
        }]
});

export default mongoose.model('AnalogSensor', AnalogSensor);
