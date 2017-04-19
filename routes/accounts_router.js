const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accounts_controller')

router.route('/')
.get(accountController.list)
.post(accountController.add)

router.route('/:id')
.put(accountController.updateAcc)
// .delete(accountController.deleteAcc)

router.route('/sub/:id')
// .put(accountController.updateSubCat)
// .delete(accountController.deleteSubCat)

module.exports = router
