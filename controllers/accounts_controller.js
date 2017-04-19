/**
 * Controller for both categories and subcategories models
 */
const Account = require('../models/account')
const Category = require('../models/category')
const Transaction = require('../models/transaction')

let accountController = {
  list: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    Account.find({ belongs_to: req.user._id }, (err, accs) => {
      if (err) {
        console.error(err)
        res.redirect('/accounts')
      } else {
        res.render('accounts/dashboard', {
          layout: 'layouts/accounts',
          accounts: accs
        })
      }
    })
  },

  viewAcc: (req, res) => {
    Account.find({ belongs_to: req.user._id }, (err, accs) => {
      if (err) {
        req.flash('error', 'Errors encountered while trying to retrieve required info. Please try again.')
        res.redirect('/accounts')
      } else {
        // get all the transactions for this accountId
        Transaction.find({ in_account: req.params.id }, (err, trans) => {
          if (err) {
            req.flash('error', 'Selected account seems to be invalid. Please try again.')
            res.redirect('/accounts')
          }
          Category.find({ belongs_to: req.user._id }, (err, cats) => {
            if (err) {
              req.flash('error', 'Errors encountered while trying to retrieve required info. Please try again.')
              res.redirect('/accounts')
            } else {
              // var topCategory
              // for (var i = 0; i < cats.length; i++) {
              //   var subCats = cats[i].subCategories
              //   for (var j = 0; j < subCats.length; j++) {
              //     console.log(subCats[j]._id,subCats[j].name)
              //     if (subCats[j]._id == '58f76a63f8cc8b7541f3509d') {
              //       topCategory = cats[i].name
              //     }
              //   }
              // }
              // console.log(topCategory)
              res.render('accounts/list_trans', {
                layout: 'layouts/accounts',
                accounts: accs,
                categories: cats,
                transactions: trans,
                accountId: req.params.id
              })
            }
          }).populate('subCategories')
        }).populate('subcategory')
      }
    })
  },

  add: (req, res) => {
    var accountName = req.body.accountName
    var accountType = req.body.accountType
    Account.create({
      name: accountName,
      type: accountType,
      belongs_to: req.user._id
    }, (err, newAcc) => {
      if (err) {
        req.flash('error', 'Errors encountered while trying to create.')
        res.redirect('/accounts')
      } else {
        req.flash('success', 'New account created.')
        res.redirect('/accounts')
      }
    })
  },

  updateAcc: (req, res) => {
    if (req.body.accountName != null && req.body.accountName) {
      Account.findByIdAndUpdate(req.params.id, {
        name: req.body.accountName,
        type: req.body.accountType
      }, (err, acc) => {
        if (err) {
          req.flash('error', 'Errors encountered while trying to update.')
          res.redirect('/accounts')
        } else {
          req.flash('success', 'Category updated.')
          res.redirect('/accounts')
        }
      })
    } else {
      req.flash('error', 'Invalid account name.')
      res.redirect('/categories')
    }
  },


}

module.exports = accountController
