const movieCtrl = require('../controllers/movieController')

const router = require('express').Router()

router.get('/new', movieCtrl.movie_create_get)
router.post('/new', movieCtrl.movie_create_post)
router.get('/', movieCtrl.movie_index_get)
router.get('/:bookingId', movieCtrl.movie_booking_get)
router.post('/:bookingId', movieCtrl.movie_booking_post)
module.exports = router
