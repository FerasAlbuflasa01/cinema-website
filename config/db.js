const mongooss = require('mongoose')

mongooss.connect(process.env.MONGOOSE_URI)
mongooss.connection.on('connected', () => {
  console.log(`connected to ${mongooss.connection.name} `)
})
module.exports = mongooss
