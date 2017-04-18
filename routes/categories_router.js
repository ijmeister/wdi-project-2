const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categories_controller')

router.route('/')
.get(categoryController.list)
.post(categoryController.add)

router.route('/:id')
.put(categoryController.updateCat)
.delete(categoryController.deleteCat)

router.route('/sub/:id')
.put(categoryController.updateSubCat)
.delete(categoryController.deleteSubCat)

module.exports = router
