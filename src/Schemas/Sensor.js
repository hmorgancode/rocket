'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Sensor = new Schema({
  board: { type: ObjectId, required: true, index: true },
  dataPin: { type: Number, required: true },
  powerPin: { type: Number }
  data: { type: ObjectId, required: true }
});
