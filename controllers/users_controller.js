const User = require('../models/user')
const UserInfo = require('../models/userInfo')
const passport = require('../config/passport')

let usersController = {
  loginView: (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/users/dashboard')
    res.render('users/login', {
      error: req.flash('error')
    })
  },
  processLogin: passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  dashboard: (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/users/login')
    res.render('dashboard', {
      error: req.flash('error'),
      layout: 'layouts/dashboard',
      userSession: req.user
    })
  },

  signupView: (req, res) => {
    res.render('users/signup')
  },

  viewProfile: (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/users/login')
    console.log(req.user._id)
    UserInfo.findByUserId(req.user._id, (err, userInfo) => {
      if (err) {
        req.flash('error', 'Something went wrong. Please contact for help.')
        // Add some errors and redirect to dashboard
        res.redirect('dashboard')
      } else {
        res.render('users/profile', {
          layout: 'layouts/dashboard',
          extractScripts: true,
          userSession: req.user
        })
      }
    })
  },

  // listOne: (req, res) => {
  //   Todo.findById(req.params.id, (err, todoItem) => {
  //     if (err) throw err
  //     res.render('todo/single-todo', { todoItem: todoItem })
  //   })
  // },

  add: (req, res) => {
    // res.send(req.body)
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    })
    newUser.save(function (err, aUser) {
      if (err) {
        console.error(err)
        // res.send(err)
        res.redirect('/users/signup')
      } else {
        UserInfo.create({
          name: req.body.email,
          targetExpense: req.body.targetExpense,
          expenseCycle: req.body.expenseCycle,
          belongs_to: aUser._id
        }, (err, userInfoNew) => {
          if (err) {
            // FLASH
            console.log('An error occurred: ' + err)
            res.redirect('/users/signup')
          } else {
            // FLASH
            passport.authenticate('local', {
              successRedirect: '/users/dashboard'
            })(req, res)
          }
        })
        // console.log('successfully created new user')
        // console.log(aUser)
      }
    })
  },
  processLogout: (req, res) => {
    req.logout()
    console.log('logged out')
    res.redirect('/users/login')
  }

  // edit: (req, res) => {
  //   Todo.findById(req.params.id, (err, todoItem) => {
  //     if (err) throw err
  //     res.render('todo/edit', { todoItem: todoItem })
  //   })
  // },
  //
  // update: (req, res) => {
  //   Todo.findOneAndUpdate({
  //     _id: req.params.id
  //   }, {
  //     title: req.body.title,
  //     description: req.body.description,
  //     completed: req.body.completed
  //   }, (err, todoItem) => {
  //     if (err) throw err
  //     res.redirect('/todos/' + todoItem.id)
  //   })
  // },
  //
  // delete: (req, res) => {
  //   Todo.findByIdAndRemove(req.params.id, (err, todoItem) => {
  //     if (err) throw err
  //     res.redirect('/todos')
  //   })
  // }

}

module.exports = usersController
