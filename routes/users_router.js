const express = require('express')
const router = express.Router()
const userController = require('../controllers/users_controller')

router.route('/')
.get(userController.loginView)
//.post(userController.add)

router.get('/dashboard', userController.dashboard)

router.route('/signup')
.get(userController.signupView)
.post(userController.add)
// router.get('/:id/edit', todoController.edit)

router.route('/login')
.get(userController.loginView)
.post(userController.processLogin)

router.route('/profile')
.get(userController.viewProfile)
.post(userController.update)

router.post('/profile/pwd', userController.updatePwd)
// router.route('/:id')
// .get(todoController.listOne)
// .put(todoController.update)
// .delete(todoController.delete)

router.get('/logout', userController.processLogout)

module.exports = router
