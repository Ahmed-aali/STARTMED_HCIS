const jwt = require('jwt-simple');

const generateToken = (id) => {
  const payload = {
    id,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
};

module.exports = { generateToken };
