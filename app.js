const express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  graphqlHttp = require('express-graphql'),
  mongoose = require('mongoose'),
  graphqlSchema = require('./graphql/schema/index'),
  graphqlResolvers = require('./graphql/resolvers/index'),
  isAuthenticated = require('./middleware/isAuthenticated');

// Use the body parser middleware
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Athorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  return next();
});

// Use the auth check middleware
app.use(isAuthenticated);

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@graphql-test-znnfd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });

