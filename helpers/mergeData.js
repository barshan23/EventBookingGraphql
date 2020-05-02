const { dateToString } = require('./date'),
  User = require('../models/user'),
  Event = require('../models/event');

exports.user = (userId) => {
  return User.findById(userId)
    .then(user => { 
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: this.events.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};

exports.events = (eventIds) => {
  return Event.find({_id: {$in: eventIds}})
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: dateToString(event._doc.date),
          creator: this.user.bind(this,  event._doc.creator)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.getEvent = (eventId) => {
  return Event.findById(eventId)
    .then(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: this.user.bind(this,  event._doc.creator)
      }
    })
    .catch(err => {
      console.log(err);

      throw err;
    })
};