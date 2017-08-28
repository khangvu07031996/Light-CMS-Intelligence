const errorLog = require('../util/logger').errorlog;

module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'You are not logged in');
  errorLog.error('Error Message : You are not logged in');
  res.redirect('/login');
};
