const Transaction = require('../models/transaction')

let transactionController = {
  // list: (req, res) => {
  //   // if (!req.isAuthenticated()) return res.redirect('/users/login')
  //   Category.find({ belongs_to: req.user._id }, (err, cats) => {
  //     if (err) {
  //       console.error(err)
  //       res.redirect('/categories')
  //     } else {
  //       res.render('categories/list', {
  //         extractScripts: true,
  //         extractStyles: true,
  //         // error: req.flash('error'),
  //         // success: req.flash('success'),
  //         categories: cats
  //       })
  //     }
  //   }).populate('subCategories')
  // },

  add: (req, res) => {
    var dateInput = req.body.transDate.split('-')
    var subCatId = req.body.subcategoryId
    var commentInput = req.body.comment
    var income = req.body.income
    var expense = req.body.expense
    var accountIdInput = req.body.accountId
    // Add a new transaction
    var transObj = {
      inAmount: income,
      outAmount: expense,
      comment: commentInput,
      date: new Date(dateInput[0], dateInput[1], dateInput[2]),
      in_account: accountIdInput,
      subcategory: subCatId
    }
    var validateError = new Transaction(transObj).validateSync()
    if (validateError && Object.keys(validateError.errors).length) {
      req.flash('error', 'There are some errors while tryign to save. Please check your inputs.')
      res.redirect('/accounts/')
    } else {
      Transaction.create(transObj, (err, newTrans) => {
        if (err) {
          req.flash('error', 'There are some errors while tryign to save. Please check your inputs.')
          res.redirect('/accounts/')
        } else {
          req.flash('success', 'Profile updated.')
          res.redirect('/accounts/' + accountIdInput)
        }
      })
    }
  }

}

module.exports = transactionController
