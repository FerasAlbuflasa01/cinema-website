const router = require('express').Router()
const authCtrl = require('../controllers/auth')
const upload = require('../middleware/upload')

// Routes - Call API's

router.get('/sign-up', authCtrl.auth_signup_get)
router.post('/sign-up', upload.single('image'), authCtrl.auth_signup_post)

router.get('/sign-in', authCtrl.auth_signin_get)
router.post('/sign-in', authCtrl.auth_signin_post)

router.get('/sign-out', authCtrl.auth_signout_get)

router.get('/edit', authCtrl.auth_edit_get)
router.put('/edit', upload.single('image'), authCtrl.auth_edit_put)

module.exports = router
