const movieCtrl = require('../controllers/movieController')

const router = require('express').Router()

router.get('/new', movieCtrl.movie_create_get)
router.post('/', movieCtrl.movie_create_post)

module.exports = router
