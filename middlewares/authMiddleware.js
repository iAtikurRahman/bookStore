
const authenticate = (req, res, next) => {
    if (!req.session.users) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      next();
    }
  };
  
  module.exports = { authenticate };