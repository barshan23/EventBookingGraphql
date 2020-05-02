const Booking = require('../../models/booking'),
  Event = require('../../models/event'),
  { dateToString } = require('../../helpers/date'),
  { user, getEvent } = require('../../helpers/mergeData'),
  transformBooking = (booking) => {
    return {
      ...booking._doc,
      _id: booking.id,
      user: user.bind(this, booking._doc.user),
      event: getEvent.bind(this, booking._doc.event),
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt)
    }
  };



module.exports = {
  bookings: (args, req) => {
    if (!req.isAuthenticated) {
      throw new Error('Unauthenticated!');
    }

    return Booking.find()
      .then(bookings => {
        return bookings.map(transformBooking)
      })
      .catch(err => {
        throw err;
      })
  },

  bookEvent: (args, req) => {
    if (!req.isAuthenticated) {
      throw new Error('Unauthenticated!');
    }

    return Event.findOne({_id: args.eventId})
      .then(event => {
        if (!event) {
          throw new Error('Event does not exists');
        }

        return new Booking({
          user: req.user.id,
          event
        })
        .save()
        .then(booking => {
          return transformBooking(booking);
        });
      })
      .catch(err => {
        console.log(err);

        throw err;
      });
  },

  cancelBooking: (args) => {
    if (!req.isAuthenticated) {
      throw new Error('Unauthenticated!');
    }

    let event;

    return Booking.findById(args.bookingId).populate('event')
      .then(booking => {
        if (!booking) {
          throw new Error('Booking does not exists!');
        }

        // get the event
        event = trasnformEvent(booking.event);

        return Booking.deleteOne({_id: booking.id});
      })
      .then(() => {
        // booking is deleted return the event
        return event;
      })
      .catch(err => {
        console.log(err);

        throw err;
      })
  }
};
