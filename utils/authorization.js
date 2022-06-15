const jwt = require('jsonwebtoken');

function authorize(request, response, next) {
  const authenticationHeader = request.headers.authorization;
  if (!authenticationHeader) {
    return response.sendStatus(401);
  }
  const token = authenticationHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = payload.user;
    next();
  } catch (error) {
    return response.status(401).send({
      message: error
    });
  }
}

module.exports = authorize;