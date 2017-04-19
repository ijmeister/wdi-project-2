/**
 * Controller for both categories and subcategories models
 */
const Account = require('../models/account')

let accountController = {
  list: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    Account.find({ belongs_to: req.user._id }, (err, accs) => {
      if (err) {
        console.error(err)
        res.redirect('/dashboard')
      } else {
        res.render('dashboard', {
          extractScripts: true,
          extractStyles: true,
          accounts: accs
        })
      }
    })
  },

  viewAcc: (req, res) => {

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

  // updateSubCat: (req, res) => {
  //   // if (!req.isAuthenticated()) return res.redirect('/users/login')
  //   // res.send('SubCatId:' + req.params.id + ' New Name: ' + req.body.subCategoryEditName)
  //   // Category.findByIdAndUpdate(req.params.id)
  //   if (req.body.subCategoryEditName != null && req.body.subCategoryEditName) {
  //     SubCategory.findByIdAndUpdate(req.params.id, { name: req.body.subCategoryEditName }, (err, subCat) => {
  //       if (err) {
  //         req.flash('error', 'Errors encountered while trying to update.')
  //         res.redirect('/categories')
  //       } else {
  //         req.flash('success', 'Subcategory updated.')
  //         res.redirect('/categories')
  //       }
  //     })
  //   } else {
  //     req.flash('error', 'Invalid subcategory name.')
  //     res.redirect('/categories')
  //   }
  // },
  //
  // deleteCat: (req, res) => {
  //   // This should remove all the subcategories as well
  //   Category.findByIdAndRemove(req.params.id, (err, cat) => {
  //     if (err) {
  //       req.flash('error', 'Errors encountered while trying to delete.')
  //       res.redirect('/categories')
  //     } else {
  //       cat.subCategories.forEach((subcategory) => {
  //         SubCategory.findByIdAndRemove(subcategory, (err, subcat) => {
  //           if (err) {
  //             req.flash('error', 'Errors encountered while trying to delete.')
  //             res.redirect('/categories')
  //           }
  //         })
  //         req.flash('success', 'Category and its corresponding subcatgories deleted.')
  //         res.redirect('/categories')
  //       })
  //     }
  //   })
  // },
  //
  // deleteSubCat: (req, res) => {
  //   // if (!req.isAuthenticated()) return res.redirect('/users/login')
  //   SubCategory.findByIdAndRemove(req.params.id, (err, cat) => {
  //     if (err) {
  //       req.flash('error', 'Errors encountered while trying to delete.')
  //       res.redirect('/categories')
  //     } else {
  //       req.flash('success', 'Subcategory deleted.')
  //       res.redirect('/categories')
  //     }
  //   })
  // }
}

module.exports = accountController
