/**
 * Controller for both categories and subcategories models
 */
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')

let categoryController = {
  list: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    Category.find({ belongs_to: req.user._id }, (err, cats) => {
      if (err) {
        console.error(err)
        res.redirect('/categories')
      } else {
        res.render('categories/list', {
          extractScripts: true,
          extractStyles: true,
          // error: req.flash('error'),
          // success: req.flash('success'),
          categories: cats
        })
      }
    }).populate('subCategories')
  },

  add: (req, res) => {
    // add new category or subcategory
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    if (req.body.categoryId != null && req.body.categoryId) {
      // new sub category
      if (req.body.subCategoryName != null && req.body.subCategoryName) {
        // res.send('new sub category:' + req.body)
        SubCategory.create({
          name: req.body.subCategoryName
        }, (err, subCat) => {
          if (err) {
            console.error(err)
            res.redirect('/categories')
          } else {
            Category.findById(req.body.categoryId, (err, foundCat) => {
              if (err) {
                console.error(err)
                res.redirect('/categories')
              } else {
                foundCat.subCategories.push(subCat._id)
                foundCat.save((err, savedCat) => {
                  if (err) {
                    console.error(err)
                    res.redirect('/categories')
                  } else {
                    req.flash('success', 'New subcategory created.')
                    res.redirect('/categories')
                  }
                })
              }
            })
          }
        })
      } else {
        req.flash('error', 'Invalid subCategory name')
        res.redirect('/categories')
      }
    } else if (req.body.categoryName != null) {
      // new category
      if (req.body.categoryName) {
        Category.create({
          name: req.body.categoryName,
          belongs_to: req.user._id
        }, (err, cat) => {
          if (err) {
            console.error(err)
            res.redirect('/categories')
          } else {
            req.flash('success', 'New category created.')
            res.redirect('/categories')
          }
        })
      } else {
        req.flash('error', 'Invalid category name.')
        res.redirect('/categories')
      }
    } else {
      req.flash('error', 'Invalid input.')
      res.redirect('/categories')
    }
  },

  updateCat: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    // res.send('CatId' + req.params.id + ' New Name: ' + req.body.categoryEditName)
    // Category.findByIdAndUpdate(req.params.id)
    if (req.body.categoryEditName != null && req.body.categoryEditName) {
      Category.findByIdAndUpdate(req.params.id, { name: req.body.categoryEditName }, (err, cat) => {
        if (err) {
          req.flash('error', 'Errors encountered while trying to update.')
          res.redirect('/categories')
        } else {
          req.flash('success', 'Category updated.')
          res.redirect('/categories')
        }
      })
    } else {
      req.flash('error', 'Invalid category name.')
      res.redirect('/categories')
    }
  },

  updateSubCat: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    // res.send('SubCatId:' + req.params.id + ' New Name: ' + req.body.subCategoryEditName)
    // Category.findByIdAndUpdate(req.params.id)
    if (req.body.subCategoryEditName != null && req.body.subCategoryEditName) {
      SubCategory.findByIdAndUpdate(req.params.id, { name: req.body.subCategoryEditName }, (err, subCat) => {
        if (err) {
          req.flash('error', 'Errors encountered while trying to update.')
          res.redirect('/categories')
        } else {
          req.flash('success', 'Subcategory updated.')
          res.redirect('/categories')
        }
      })
    } else {
      req.flash('error', 'Invalid subcategory name.')
      res.redirect('/categories')
    }
  },

  deleteCat: (req, res) => {
    // This should remove all the subcategories as well
    Category.findByIdAndRemove(req.params.id, (err, cat) => {
      if (err) {
        req.flash('error', 'Errors encountered while trying to delete.')
        res.redirect('/categories')
      } else {
        cat.subCategories.forEach((subcategory) => {
          SubCategory.findByIdAndRemove(subcategory, (err, subcat) => {
            if (err) {
              req.flash('error', 'Errors encountered while trying to delete.')
              res.redirect('/categories')
            }
          })
          req.flash('success', 'Category and its corresponding subcatgories deleted.')
          res.redirect('/categories')
        })
      }
    })
  },

  deleteSubCat: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    SubCategory.findByIdAndRemove(req.params.id, (err, cat) => {
      if (err) {
        req.flash('error', 'Errors encountered while trying to delete.')
        res.redirect('/categories')
      } else {
        req.flash('success', 'Subcategory deleted.')
        res.redirect('/categories')
      }
    })
  }
}

module.exports = categoryController
