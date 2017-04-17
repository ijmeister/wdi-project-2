const User = require('../models/user')

let categoryController = {
  list: (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/users/login')
    res.render('categories/list', {
      extractScripts: true,
      extractStyles: true
      // error: req.flash('error')
    })
  }
}

module.exports = categoryController
