const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categories_controller')

router.route('/')
.get(categoryController.list)

// router.get('/dashboard', userController.dashboard)

module.exports = router
