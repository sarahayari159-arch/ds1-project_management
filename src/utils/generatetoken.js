const jwt = require('jsonwebtoken');

const SESSION_EXPIRES_IN = '1d';
const generateToken = (_id, login, role) => {
  const token = jwt.sign(
    { 
      id : _id, 
      role: role,
      login: login,
      token_type: 'session'
    },
    process.env.JWT_SECRET,
    { expiresIn: SESSION_EXPIRES_IN }
  );

  console.log('\n[SESSION TOKEN GENERATED]');
  console.log(`userId=${_id} login=${login} role=${role}`);
  console.log(`expiresIn=${SESSION_EXPIRES_IN}`);
  console.log(`token=${token}\n`);

  return token;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
