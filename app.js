const express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  graphqlHttp = require('express-graphql'),
  mongoose = require('mongoose'),
  graphqlSchema = require('./graphql/schema/index'),
  graphqlResolvers = require('./graphql/resolvers/index');

// Use the body parser middleware
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@graphql-test-znnfd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

