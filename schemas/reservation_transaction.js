const mongoose = require('mongoose');

const { Schema } = mongoose;

const reservationTransaction = new Schema({

  // short-hash
  ID: {
    type: String,
    required: true,
    unique: true,
  },

  WorkPlaceID: {
    type: String,
    required: true,
  },

  MenuName: {
    type: String,
    required: false,
    unique: true,
  },

  ReservedDateTime: {
    type: Date,
    required: true,
  },

  Personnel: {
    type: Number,
    required: true
  },

  Detail : {
    UserName: {
      type: String,
      required: true
    },

    PhoneNum: {
      type: String,
      required: true
    }
  }

}, {collection: "ReservationTransaction"});

module.exports = mongoose.model('ReservationTransaction', reservationTransaction);
