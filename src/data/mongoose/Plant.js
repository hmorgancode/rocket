'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Plant = new Schema({
  name: { type: String, required: true, trim: true },
  altName: { type: String, trim: true },
  thumbnail: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  notes: { type: String, trim: true },
  board: { type: ObjectId, required: true },
  sensors: [ObjectId]
});

export default mongoose.model('Plant', Plant);

// validators: maxlength? minlength?

// Plant.index({ name: 1, tags: -1 }); // if you want to mess w/ a compound index?

// Plant.methods.findPlantsSharingSensor

// Plant.statics.findByName
// Plant.statics.findByTags
