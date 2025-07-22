const movieCtrl = require('../controllers/movieController')

const router = require('express').Router()

router.get('/new', movieCtrl.movie_create_get)
router.post('/new', movieCtrl.movie_create_post)
router.get('/', movieCtrl.movie_index_get)

router.get('/:bookingId', movieCtrl.movie_booking_get)
router.post('/:bookingId', movieCtrl.movie_booking_post)

router.put('/:movieId', movieCtrl.movie_update_put)
router.delete('/:movieId', movieCtrl.movie_delete_delete)

router.get('/:bookingId/api', movieCtrl.booking_api_get)
module.exports = router
