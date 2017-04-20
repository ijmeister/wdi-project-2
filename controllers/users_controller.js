const User = require('../models/user')
const UserInfo = require('../models/userInfo')
const passport = require('../config/passport')

let usersController = {
  loginView: (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/accounts/dashboard')
    res.render('users/login', {
      layout: 'layouts/login'
    })
  },
  processLogin: passport.authenticate('local', {
    successRedirect: '/accounts/',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  // dashboard: (req, res) => {
  //   // if (!req.isAuthenticated()) return res.redirect('/users/login')
  //   res.render('dashboard', {
  //     // error: req.flash('error'),
  //     // layout: 'layouts/dashboard',
  //     extractScripts: true,
  //     extractStyles: true
  //     // userSession: req.user
  //   })
  // },

  signupView: (req, res) => {
    res.render('users/signup', {
      layout: 'layouts/login'
      // error: req.flash('error')
    })
  },

  viewProfile: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    UserInfo.findByUserId(req.user._id, (err, userInfo) => {
      if (err) {
        req.flash('error', 'Something went wrong. Please contact for help.')
        // Add some errors and redirect to dashboard
        res.redirect('dashboard')
      } else {
        res.render('users/profile', {
          // layout: 'layouts/dashboard',
          extractScripts: true,
          extractStyles: true,
          // userSession: req.user,
          userInfo: userInfo
          // success: req.flash('success'),
          // error: req.flash('error')
        })
      }
    })
  },

  add: (req, res) => {
    // validate UserInfo
    var validateError = new UserInfo({
      name: req.body.name,
      targetExpense: req.body.targetExpense,
      expenseCycle: req.body.expenseCycle
    }).validateSync()
    delete validateError.errors['belongs_to']
    if (Object.keys(validateError.errors).length) {
      // console.log(Object.keys(validateError.errors).length)
      // res.send(validateError)
      req.flash('error', 'Please check your inputs. All fields are required.')
      res.redirect('/users/signup')
    } else {
      var newUser = new User({
        email: req.body.email,
        password: req.body.password
      })
      newUser.save(function (err, aUser) {
        if (err) {
          // console.error(err)
          // res.send(err)
          if (err.errors[ 'email' ] && err.errors[ 'email' ].kind === 'unique') {
            req.flash('error', 'An email with the same address already exist.')
          } else {
            req.flash('error', 'Please check your inputs. All fields are required and password must be 8 characters long.')
          }
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
                successRedirect: '/accounts/'
              })(req, res)
            }
          })
        }
      })
    }
  },
  update: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
    UserInfo.findOneAndUpdate({ belongs_to: req.user._id }, {
      name: req.body.name,
      targetExpense: req.body.targetExpense,
      expenseCycle: req.body.expenseCycle
    }, function (err, userInfo) {
      if (err) {
        // console.log(err)
        req.flash('error', 'Errors encountered during update. Please check your inputs.')
        // Add some errors and redirect to dashboard
        res.redirect('/users/profile')
      } else {
        req.flash('success', 'Profile updated.')
        res.redirect('/users/profile')
      }
    })
  },
  updatePwd: (req, res) => {
    // if (!req.isAuthenticated()) return res.redirect('/users/login')
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
        req.flash('error', 'Passwords did not match.')
        res.redirect('/users/profile')
      } else if (!user.validPassword(oldPassword)) {
        // Check if the old password is correct
        req.flash('error', 'Incorrect old password.')
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
    req.flash('success', 'You have logged out.')
    res.redirect('/users/login')
  }
}

module.exports = usersController
