'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Board = new Schema({
  location: { type: String, unique: true, required: true, trim: true }, // the "name" of the board.
  type: { type: String, trim: true },
  isRemote: { type: Boolean, default: true }, // for now, only one board is hardwired
  thumbnail: { type: String, trim: true },
  sensors: [ObjectId]
});

export default mongoose.model('Board', Board);
