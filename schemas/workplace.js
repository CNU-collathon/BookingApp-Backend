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
  }

});

module.exports = mongoose.model('WorkPlace', workPlaceSchema);
