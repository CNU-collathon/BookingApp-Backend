const mongoose = require('mongoose');

const { Schema } = mongoose;

const selfEmployedSchema = new Schema({

  ID: {
    type: String,
    required: true,
    unique: true,
  },
  
  PW: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: false,
  },

  PhoneNumber: {
    type: String,
    required: false,
  },

}, {collection: "SelfEmployed"});

module.exports = mongoose.model('SelfEmployed', selfEmployedSchema);
