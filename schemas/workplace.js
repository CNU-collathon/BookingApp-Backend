const mongoose = require('mongoose');

const { Schema } = mongoose;

const workPlaceSchema = new Schema({

  SelfEmployedID: {
    type: String,
    required: true,
  },

  WorkPlaceID: {
    type: String,
    required: true,
    unique: true,
  },

  Address: {
    type: String,
    required: false,
  },

  WorkPlaceInfo: {
    type: String,
    required: false,
  },

  Name: {
    type: String,
    required: true
  },

  Category: {
    type: String,
    required: true
  },

  Image: {
    
  }

}, { collection: "WorkPlace"});

module.exports = mongoose.model('WorkPlace', workPlaceSchema);
