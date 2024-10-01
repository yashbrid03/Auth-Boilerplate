const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    console.log(user)
    next();
  });
};
 
exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

exports.refreshAuthenticateToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  console.log("refresh token ",token)

  if (!token) {
    console.log("hello")
    return res.status(403).json({ error: 'You need to login' });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      console.log("hello2")
      return res.status(403).json({ error: 'You need to login' });
    }
    next();
  });
};
