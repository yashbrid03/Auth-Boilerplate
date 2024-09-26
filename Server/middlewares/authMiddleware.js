const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const cookie = req.headers.cookie;
  if(!cookie){
    return res.status(404).json({error:"Cookie expired"});
  }
  const token = cookie.split("=")[1];

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
