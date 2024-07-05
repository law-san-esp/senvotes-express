const jwt = require('jsonwebtoken');
const tokenService = require('../utils/tokenService');

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  return tokenService.verifyAuthToken(token)
  .then((authToken) => {
    req.user = authToken.user;
    next();
  })
  .catch((error) => {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  });
};

exports.adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  return tokenService.verifyAuthToken(token)
  .then((authToken) => {
    if (authToken.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    req.user = authToken.user;
    next();
  })
  .catch((error) => {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  });
}