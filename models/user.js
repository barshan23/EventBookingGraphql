const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  userSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
    ]
  });

module.exports = mongoose.model('User', userSchema);