const crypto = require('crypto'),
  Event = require('../../models/event'),
  User = require('../../models/user'),
  Booking = require('../../models/booking'),
  user = (userId) => {
    return User.findById(userId)
      .then(user => {
        return {
          ...user._doc,
          _id: user.id,
          createdEvents: events.bind(this, user._doc.createdEvents)
        };
      })
      .catch(err => {
        throw err;
      });
  },
  events = (eventIds) => {
    return Event.find({_id: {$in: eventIds}})
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this,  event._doc.creator)
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  getEvent = (eventId) => {
    return Event.findById(eventId)
      .then(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this,  event._doc.creator)
        }
      })
      .catch(err => {
        console.log(err);

        throw err;
      })
  },
  trasnformEvent = (event) => {
    return {
      ...event._doc,
      creator: user.bind(this, event._doc.creator),
      _id: event.id,
      date: new Date(event._doc.date).toISOString()
    };
  };

module.exports = {
  events: () => {
    return Event.find().populate('creator')
      .then(events => {
        return events.map(event => {
          return trasnformEvent(event);
        })
      }).catch(err => {
        console.log(err);

        throw err;
      });
  },

  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return {
            ...booking._doc,
            _id: booking.id,
            user: user.bind(this, booking._doc.user),
            event: getEvent.bind(this, booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()
          };
        })
      })
      .catch(err => {
        throw err;
      })
  },

  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5d5504040eae0531bd044033'
    });

    let createdEvent;

    return event
      .save()
      .then(result => {
        createdEvent = trasnformEvent(result);

        console.log(result);

        return User.findById('5d5504040eae0531bd044033');
      })
      .then(user => {
        if (!user) {
          throw new Error('User does not exists');
        }

        user.createdEvents.push(event);

        return user.save();
      })
      .then(() => {
        return createdEvent;
      })
      .catch((err) => {
        console.log(err);

        throw err;
      });
  },

  createUser: (args) => {
    return User.findOne({email: args.userInput.email}).then(user => {
      if (user) {
        throw new Error('User already exists');
      }

      return new User({
        email: args.userInput.email,
        password: crypto.createHash('sha256').update(args.userInput.password).digest('base64')
      }).save();
    })
    .then(result => {
      console.log(result);

      return {email: result.email, _id: result.id};
    }).catch(err => {
      console.log(err);

      throw err;
    });
  },

  bookEvent: (args) => {
    return Event.findOne({_id: args.eventId})
      .then(event => {
        if (!event) {
          throw new Error('Event does not exists');
        }

        return new Booking({
          user: '5d5504040eae0531bd044033',
          event
        })
        .save()
        .then(booking => {
          return {
            ...booking._doc,
            _id: booking.id,
            user: user.bind(this, booking._doc.user),
            event: getEvent.bind(this, booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()
          };
        });
      })
      .catch(err => {
        console.log(err);

        throw err;
      });
  },

  cancelBooking: (args) => {
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
        console.log('booking deleted');
        console.log(event);

        // booking is deleted return the event
        return event;
      })
      .catch(err => {
        console.log(err);

        throw err;
      })
  }
};
