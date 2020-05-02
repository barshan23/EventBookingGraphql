const crypto = require('crypto'),
  User = require('../../models/user'),
  jwt = require('jsonwebtoken');

module.exports = {
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

  login: ({ email, password }) => {
    return User.findOne({ email: email }).then((user) => {
      if (!user) {
        console.log('User ', user, ' does not exists');

        throw new Error('Invalid credentials!');
      }

      if (user.password !== crypto.createHash('sha256').update(password).digest('base64')) {
        console.log('Wrong password');

        throw new Error('Invalid credentials!');
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SERVER_SECRET, {
        expiresIn: '1h'
      });

      return { userId: user.id, token, tokenExpiration: 1 };
    }).catch ((err) => {
      console.log(err);

      throw err;
    })
  }
};
