const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next()
  }
  res.send('Access denied. Admins only.') // Deny access if not admin
}
module.exports = isAdmin
