require('dotenv').config()
var mongoose = require('mongoose')
var User = require('../models/user')
const dbURI = process.env.MONGO_DB_URI_TEST
const clearDB = require('mocha-mongoose')(dbURI)
const assert = require('chai').assert

describe('Creating a User', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
  })

  it('should create successfully', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, function (err, user) {
      if (err) {
        return done(err)
      } else {
        done()
      }
    })
  })

  it('should give an error on invalid email addresses', function (done) {
    User.create({
      email: 'test',
      password: 'password'
    }, function (err, user) {
      assert.isOk(err.errors[ 'email' ])
      done()
    })
  })

  it('should give an error on duplicate email address', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, function (err, user) {
      if (err) return done(err)

      User.create({
        email: 'test@test.co',
        password: 'password'
      }, function (err, user) {
        assert.isOk(err.errors[ 'email' ])
        done()
      })
    })
  })

  it('should give an error on invalid password', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'short'
    }, function (err, user) {
      assert.isOk(err.errors[ 'password' ])
      done()
    })
  })

  it('should hash the password before save', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, function (err, newUser) {
      if (err) return done(err)
      assert.notStrictEqual(newUser.password, 'password')
      done()
    })
  })
})

describe('User instance methods', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
  })

  describe('validPassword', function () {
    it('should validate/invalidate a correct/incorrect password', function (done) {
      User.create({
        email: 'test@test.co',
        password: 'password'
      }, function (err, newUser) {
        if (err) return done(err)
        User.findOne(function (err, user) {
          if (err) return done(err)
          assert.isTrue(user.validPassword('password'))
          assert.isFalse(user.validPassword('')) // no password
          done()
        })
      })
    })
  })

  describe('toJSON', function () {
    it('should return a user without a password field', function (done) {
      User.create({
        email: 'test@test.co',
        password: 'password'
      }, function (err, newUser) {
        if (err) return done(err)
        User.findOne({}, function (err, user) {
          if (err) return done(err)
          assert.isUndefined(user.toJSON().password)

          // clear DB at the end
          clearDB(done)
        })
      })
    })
  })
})
