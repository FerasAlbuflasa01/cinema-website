const movieCtrl = require('../controllers/movieController')

const router = require('express').Router()

router.get('/new', movieCtrl.movie_create_get)
router.post('/new', movieCtrl.movie_create_post)
router.get('/', movieCtrl.movie_index_get)
router.put("/:movieId", movieCtrl.movie_update_put);
router.delete("/:movieId", movieCtrl.movie_delete_delete);

module.exports = router
