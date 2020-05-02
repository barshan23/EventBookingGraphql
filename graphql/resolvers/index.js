const authResolver = require('./auth'),
  eventResolver = require('./event'),
  bookingResolver = require('./booking');

module.exports = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver
};
