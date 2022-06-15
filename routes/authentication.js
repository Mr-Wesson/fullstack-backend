var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

const usersDB = require('../database/db');
const generateJWT = require('../utils/jwt');

/* POST /login */

/**
 * {
    "username": "username@mail.com",
    "password": "admin1234"
    }
 */
router.post('/', async (request, response) => {
  const {username, password} = request.body
  const databaseUser = usersDB.find(user => user.username == username);
  if (!databaseUser) {
    return response.sendStatus(401);
  }
  const isAuhtorized = await bcrypt.compare(password, databaseUser.password);
  if(!isAuhtorized) {
    return response.sendStatus(401);
  }

  // CREATE JWT - JSON WEB TOKEN
  const token = generateJWT(username);
  response.send(token);
});

module.exports = router;