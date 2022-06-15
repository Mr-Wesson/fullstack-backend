var express = require('express');
var router = express.Router();
var usersDB = require('../database/db.json');
var authorization = require('../utils/authorization');

const bcrypt = require('bcrypt')
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(usersDB.map(user => {
    return {
      username: user.username,
      name: user.name
    };
  }));
});

/* POST users create a new user. */
/**
 * {
 *  username: username@mail.com,
 *  password: admin1234,
 *  name: Mr User Name
 * }
 */
router.post('/', async (request, response) => {
  const {username, password, name} = request.body;
  const newUser = {
    username: username,
    name: name,
    password: undefined,
    created: Date.now(), // UNIX timestamp
    updated: Date.now()
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  newUser.password = hashedPassword;

  usersDB.push(newUser);
  await fs.writeFileSync('./database/db.json', JSON.stringify(usersDB));

  response.sendStatus(201);
});

/* PUT /users updates users in database */
router.put('/', authorization, async (request, response, next) => {
  const databaseUser = usersDB.find(databaseUser => databaseUser.username == request.user.username);
  databaseUser.name = request.body.name;
  databaseUser.updated = Date.now();
  await fs.writeFileSync('./database/db.json', JSON.stringify(usersDB));

  response.sendStatus(204);
});

/* DELETE /users */
// router.delete('/', authorization, (request, response, next) => {
//   response.sendStatus(501);
// });

module.exports = router;
