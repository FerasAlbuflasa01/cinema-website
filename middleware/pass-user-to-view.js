// so we can pass user to front end to put it in nav if stetment
const passUserTOView = (req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null
  next()
}
module.exports = passUserTOView
