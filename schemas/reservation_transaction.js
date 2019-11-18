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

  Menu: [{
    MenuName: {
      type: String,
      required: true,
      unique: true
    },

    Price: {
      type: Number,
      required: true
    },

    Personnel: {
      type: Number,
      required: true
    }
  }],

  ReservedDateTime: {
    type: Date,
    required: true
  },

  EndDateTime: {
    type: Date,
    required: false
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
