require('dotenv').config();

const jwt = require('jsonwebtoken');

const jwt_methods = {
  generateAccessToken: function(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'});
  },
  generateRefreshToken: function(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  },
  verifyAccessToken: function(token, callback) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
      if(err) {
        callback(err)
      } else {
        callback(null, user)
      }
    });
  }
}

module.exports = jwt_methods;
