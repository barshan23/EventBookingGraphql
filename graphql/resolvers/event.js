const Event = require('../../models/event'),
  User = require('../../models/user'),
  { dateToString } = require('../../helpers/date'),
  { user } = require('../../helpers/mergeData'),
  transformEvent = (event) => {
    return {
      ...event._doc,
      creator: user.bind(this, event._doc.creator),
      _id: event.id,
      date: dateToString(event._doc.date)
    };
  };

module.exports = {
  events: () => {
    return Event.find().populate('creator')
      .then(events => {
        return events.map(event => {
          return transformEvent(event);
        })
      }).catch(err => {
        console.log(err);

        throw err;
      });
  },

  createEvent: (args, req) => {
    if (!req.isAuthenticated) {
      throw new Error('Unauthenticated!');
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.user.id
    });

    let createdEvent;

    return event
      .save()
      .then(result => {
        createdEvent = transformEvent(result);

        console.log(result);

        return User.findById(req.user.id);
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
  }
};
