const assert = require('chai').assert
const mongoose = require('mongoose')
require('dotenv').config()
const dbURI = process.env.MONGO_DB_URI_TEST
const clearDB = require('mocha-mongoose')(dbURI)

// models
const User = require('../models/user')
const UserInfo = require('../models/userInfo')

describe('Creating User Info for User', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
    mongoose.Promise = global.Promise
  })

  it('New user info can be created and called back successfully', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) return done(err)
      UserInfo.create({
        name: 'test user',
        targetExpense: 1500,
        expenseCycle: 1,
        belongs_to: newUser._id
      }, (err, userInfoNew) => {
        if (err) return done(err)
        UserInfo.findByUserId(newUser._id, (err, userInfo) => {
          if (err) return done(err)
          assert.strictEqual(userInfo.name, userInfoNew.name)
          assert.strictEqual(userInfo.belongs_to.email, newUser.email)
          done()
        })
      })
    })
  })

  it('should give an error on invalid fields', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) return done(err)
      UserInfo.create({}, (err, userInfoNew) => {
        assert.isOk(err.errors[ 'name' ])
        assert.isOk(err.errors[ 'targetExpense' ])
        assert.isOk(err.errors[ 'expenseCycle' ])
        assert.isOk(err.errors[ 'belongs_to' ])
        done()
      })
    })
  })

  it('should give an error on min and max validation for targetExpense and expenseCycle', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) return done(err)
      UserInfo.create({
        name: 'test user',
        targetExpense: -1,
        expenseCycle: 0,
        belongs_to: newUser._id
      }, (err, userInfoNew) => {
        assert.isOk(err.errors[ 'targetExpense' ])
        assert.isOk(err.errors[ 'expenseCycle' ])
        done()
      })
    })
  })
})

describe('Updating User Info', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
    mongoose.Promise = global.Promise
  })

  it('User Info fields can be updated with new values', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) return done(err)
      UserInfo.create({
        name: 'test user',
        targetExpense: 1500,
        expenseCycle: 1,
        belongs_to: newUser._id
      }, (err, userInfoNew) => {
        // start updating
        if (err) return done(err)
        UserInfo.findOneAndUpdate({ _id: userInfoNew._id }, {
          name: 'new name',
          targetExpense: 2000
        }, function (err, userInfo) {
          if (err) return done(err)
          User.findById(userInfoNew.belongs_to, (err, user) => {
            if (err) return done(err)
            user.password = 'new password'
            user.save((err, user) => {
              if (err) return done(err)
              assert.isTrue(user.validPassword('new password'))

              UserInfo.findByUserId(user._id, (err, userInfo) => {
                if (err) return done(err)
                assert.strictEqual(userInfo.name, 'new name')
                done()
              })
            })
          })
        })
      })
    })
  })
})
