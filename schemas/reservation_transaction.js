const mongoose = require('mongoose');

const { Schema } = mongoose;

const reservationTransaction = new Schema({

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

});

module.exports = mongoose.model('ReservationTransaction', reservationTransaction);
