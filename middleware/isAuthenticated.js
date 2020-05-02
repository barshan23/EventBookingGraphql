const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  let token, decodedToken;

  if (!authHeader) {
    req.isAuthenticated = false;

    return next();
  }

  token = authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    req.isAuthenticated = false;

    return next();
  }

  try {
    decodedToken = jwt.verify(token, process.env.SERVER_SECRET);
  } catch (err) {
    req.isAuthenticated = false;

    return next();
  }

  if (!decodedToken) {
    req.isAuthenticated = false;

    return next();
  }

  req.isAuthenticated = true;
  req.user = {
    id: decodedToken.userId,
    email: decodedToken.eamil
  };

  return next();
};
