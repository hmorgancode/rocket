'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Plant = new Schema({
  name: { type: String, required: true, trim: true },
  altName: { type: String, trim: true },
  thumbnail: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  notes: { type: String, trim: true },
  board: { type: ObjectId, required: true },
  sensors: { type: [ObjectId], required: true, index: true } // do you want a secondary index here?
});

module.exports = mongoose.model('Plant', Plant);

// validators: maxlength? minlength?

// Plant.index({ name: 1, tags: -1 }); // if you want to mess w/ a compound index?

// Plant.methods.findPlantsSharingSensor

// Plant.statics.findByName
// Plant.statics.findByTags
