const movieCtrl = require('../controllers/movieController')
const isSignedIn = require('../middleware/is-signed-in')
const upload = require('../middleware/upload')
const router = require('express').Router()

router.get('/new', isSignedIn, movieCtrl.movie_create_get)
router.post(
  '/new',
  isSignedIn,
  upload.single('poster'),
  movieCtrl.movie_create_post
)

router.get('/', movieCtrl.movie_index_get)

router.get('/bookings/:bookingId', isSignedIn, movieCtrl.movie_booking_get)
router.post('/bookings/:bookingId', isSignedIn, movieCtrl.movie_booking_post)
router.get('/:movieId', movieCtrl.movie_show_get)
router.get('/:movieId/edit', isSignedIn, movieCtrl.movie_update_get)
router.put('/:movieId', isSignedIn, movieCtrl.movie_update_put)
router.delete('/:movieId', isSignedIn, movieCtrl.movie_delete_delete)

router.get('/bookings/:bookingId/api', movieCtrl.booking_api_get)
module.exports = router
