'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Board = new Schema({
  location: { type: String, required: true, trim: true },
  type: { type: String, trim: true },
  remote: { type: Boolean, default: true }, // for now, only one board is hardwired
  thumbnail: { type: String, trim: true }
  sensors: [{
    dataPin: { type: Number, required: true }, // get/set to round to integer?
    powerPin: { type: Number, required: () => !this.remote },
    data: { type: ObjectId, required: true }
  }]
});
