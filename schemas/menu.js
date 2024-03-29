const mongoose = require('mongoose');

const { Schema } = mongoose;

const menuSchema = new Schema({

  WorkPlaceID: {
    type: String,
    required: true,
  },

  Name: {
    type: String,
    required: true,
    unique: true,
  },

  Desc: {
    type: String,
    required: false,
  },

  Price: {
    type: Number,
    required: true
  },

  Image: {
    
  }

}, {collection: "Menu"});

module.exports = mongoose.model('Menu', menuSchema);
