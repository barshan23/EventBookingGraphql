const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  booking = new Schema({
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }, { timestamps: true });

  module.exports = mongoose.model('Booking', booking); // create the model