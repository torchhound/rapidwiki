module.exports.sessionChecker = function sessionChecker(req, res, next) {
  if (!req.session.user || !req.cookies.userId) {
    res.redirect('/auth');
  } else {
    next();
  }
}