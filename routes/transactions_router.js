const express = require('express')
const router = express.Router()
const transController = require('../controllers/transactions_controller')

router.route('/')
// .get(transController.list)
.post(transController.add)

router.route('/:id')
// .get(transController.viewAcc)
.put(transController.updateTrans)

router.route('/:id/:accountid')
.delete(transController.deleteTrans)

module.exports = router
