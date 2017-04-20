const Transaction = require('../models/transaction')

let transactionController = {
  add: (req, res) => {
    // var dateInput = req.body.transDate.split('-')
    var subCatId = req.body.subcategoryId
    var commentInput = req.body.comment
    var income = req.body.income ? req.body.income : 0
    var expense = req.body.expense ? req.body.expense : 0
    var accountIdInput = req.body.accountId
    // Add a new transaction
    var transObj = {
      inAmount: income,
      outAmount: expense,
      comment: commentInput,
      // date: new Date(dateInput[0], dateInput[1], dateInput[2]),
      date: req.body.transDate,
      in_account: accountIdInput,
      subcategory: subCatId
    }
    // res.send(transObj)
    var validateError = new Transaction(transObj).validateSync()
    if (validateError && Object.keys(validateError.errors).length) {
      req.flash('error', 'There are some errors while trying to save. Please check your inputs.')
      res.redirect('/accounts/' + accountIdInput)
    } else {
      Transaction.create(transObj, (err, newTrans) => {
        if (err) {
          req.flash('error', 'There are some errors while trying to save. Please check your inputs.')
          res.redirect('/accounts/' + accountIdInput)
        } else {
          req.flash('success', 'Transaction added.')
          res.redirect('/accounts/' + accountIdInput)
        }
      })
    }
  },
  updateTrans: (req, res) => {
    var subCatId = req.body.subcategoryId
    var commentInput = req.body.comment
    var income = req.body.income ? req.body.income : 0
    var expense = req.body.expense ? req.body.expense : 0
    var accountIdInput = req.body.accountId
    // Add a new transaction
    var transObj = {
      inAmount: income,
      outAmount: expense,
      comment: commentInput,
      date: req.body.transDate,
      in_account: accountIdInput,
      subcategory: subCatId
    }
    // res.send(transObj)
    Transaction.findByIdAndUpdate(req.params.id, transObj, (err, transaction) => {
      if (err) {
        req.flash('error', 'Errors encountered while trying to update.')
        res.redirect('/accounts/' + accountIdInput)
      } else {
        req.flash('success', 'Transaction updated.')
        res.redirect('/accounts/' + accountIdInput)
      }
    })
  },
  deleteTrans: (req, res) => {
    Transaction.findByIdAndRemove(req.params.id, (err, transaction) => {
      if (err) {
        req.flash('error', 'Errors encountered while trying to delete.')
        res.redirect('/accounts/' + req.params.accountid)
      } else {
        req.flash('success', 'Transaction deleted.')
        res.redirect('/accounts/' + req.params.accountid)
      }
    })
  }
}

module.exports = transactionController
