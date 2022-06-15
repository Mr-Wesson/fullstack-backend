const jwt = require('jsonwebtoken');

function generateJWT(id) {
  const payload = {
    user: {
      username: id
    }
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h"});
  return token;
}

module.exports = generateJWT;