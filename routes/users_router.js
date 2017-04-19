const express = require('express')
const router = express.Router()
const userController = require('../controllers/users_controller')
const isLoggedIn = require('../middleware/isLoggedIn')

router.route('/')
.get(userController.loginView)

// router.get('/dashboard', isLoggedIn, userController.dashboard)

router.route('/signup')
.get(userController.signupView)
.post(userController.add)
// router.get('/:id/edit', todoController.edit)

router.route('/login')
.get(userController.loginView)
.post(userController.processLogin)

router.route('/profile')
.get(isLoggedIn, userController.viewProfile)
.post(isLoggedIn, userController.update)

router.post('/profile/pwd', isLoggedIn, userController.updatePwd)

router.get('/logout', isLoggedIn, userController.processLogout)

module.exports = router
