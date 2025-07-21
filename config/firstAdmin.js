const Admin = require('../models/admin')
const firstAdmin = async (req, res, next) => {
  const listOfAdmin = Admin.find()
  if (listOfAdmin.leangth === 0) {
    await Admin.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    })
  }
  next()
}
module.exports = firstAdmin
