const User = require('../models/user')
const UserInfo = require('../models/userInfo')
const passport = require('../config/passport')

let usersController = {
  loginView: (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/users/dashboard')
    res.render('users/login', {
      layout: 'layouts/login',
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
      // layout: 'layouts/dashboard',
      extractScripts: true,
      userSession: req.user
    })
  },

  signupView: (req, res) => {
    res.render('users/signup')
  },

  viewProfile: (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/users/login')
    UserInfo.findByUserId(req.user._id, (err, userInfo) => {
      if (err) {
        req.flash('error', 'Something went wrong. Please contact for help.')
        // Add some errors and redirect to dashboard
        res.redirect('dashboard')
      } else {
        res.render('users/profile', {
          // layout: 'layouts/dashboard',
          extractScripts: true,
          userSession: req.user,
          userInfo: userInfo,
          success: req.flash('success'),
          error: req.flash('error')
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
          name: req.body.name,
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
  update: (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/users/login')
    UserInfo.findOneAndUpdate({ belongs_to: req.user._id }, {
      name: req.body.name,
      targetExpense: req.body.targetExpense,
      expenseCycle: req.body.expenseCycle
    }, function (err, userInfo) {
      if (err) {
        console.log(err)
        // Add some errors and redirect to dashboard
        res.redirect('dashboard')
      } else {
        console.log('successfully updated.')
        req.flash('success', 'Profile updated.')
        res.redirect('/users/profile')
        // res.redirect('/users/profile')
        // User.findById(req.user._id, (err, user) => {
        //   if (err) {
        //     console.log(err)
        //     res.redirect('dashboard')
        //   }
        //   // user.password = req.body.password
        //   user.save((err, user) => {
        //     if (err) {
        //       console.log(err)
        //       res.redirect('dashboard')
        //     } else {
        //       console.log('successfully updated.')
        //       req.flash('success', 'Profile updated.')
        //       res.redirect('/users/profile')
        //       // passport.authenticate('local', {
        //       //   successRedirect: '/users/profile'
        //       // })(req, res)
        //     }
        //   })
        // })
      }
    })
  },
  updatePwd: (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/users/login')
    let oldPassword = req.body.currentPassword
    let newPassword = req.body.newPassword
    let newPassword2 = req.body.newPassword2
    User.findOne({ _id: req.user._id }, function (err, user) {
      if (err) {
        console.log(err)
        // Add some errors and redirect to dashboard
        res.redirect('dashboard')
      } else if (newPassword !== newPassword2) {
      // if the passwords didn't match
        req.flash('error', 'Passwords did not match')
        res.redirect('/users/profile')
      } else if (!user.validPassword(oldPassword)) {
        // Check if the old password is correct
        req.flash('error', 'Incorrect old password')
        res.redirect('/users/profile')
      } else {
        // change password
        User.findById(req.user._id, (err, user) => {
          if (err) {
            console.log(err)
            res.redirect('dashboard')
          } else {
            user.password = req.body.newPassword
            user.save((err, user) => {
              if (err) {
                req.flash('error', err.errors['password'].message)
                res.redirect('/users/profile')
              } else {
                console.log('Passwrod updated.')
                req.flash('success', 'Password updated.')
                res.redirect('/users/profile')
              }
            })
          }
        })
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
