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
        if (err) done(err)
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
