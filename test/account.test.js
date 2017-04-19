require('dotenv').config()
const mongoose = require('mongoose')
const dbURI = process.env.MONGO_DB_URI_TEST
const clearDB = require('mocha-mongoose')(dbURI)
const assert = require('chai').assert

const Account = require('../models/account')
const User = require('../models/user')

describe('CRUD on Account Model', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
    mongoose.Promise = global.Promise
  })

  it('should create successfully with a userID included', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) {
        return done(err)
      } else {
        Account.create({
          name: 'DBS Savings',
          type: 'Savings',
          belongs_to: newUser._id
        }, (err, cat) => {
          if (err) {
            return done(err)
          } else {
            Account.find({}, (err, accs) => {
              if (err) return done(err)
              assert.strictEqual(accs[0].name, 'DBS Savings')
              assert.strictEqual(accs[0].type, 'Savings')
              assert.deepEqual(accs[0].belongs_to, newUser._id)
              done()
            })
          }
        })
      }
    })
  })

  it('Can update category name', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) {
        return done(err)
      } else {
        Account.create({
          name: 'DBS Savings',
          type: 'Savings',
          belongs_to: newUser._id
        }, (err, newAcc) => {
          if (err) {
            return done(err)
          } else {
            Account.findByIdAndUpdate(newAcc._id, { name: 'DBS Credit Card' }, (err, acc) => {
              if (err) return done(err)

              Account.findById(newAcc._id, (err, foundAcc) => {
                if (err) return done(err)
                assert.strictEqual(foundAcc.name, 'DBS Credit Card')
                done()
              })
            })
          }
        })
      }
    })
  })

  it('Should error when trying to create with invalid account type', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) {
        return done(err)
      } else {
        Account.create({
          name: 'DBS Savings',
          type: 'Invalid',
          belongs_to: newUser._id
        }, (err, newAcc) => {
          assert.isOk(err.errors[ 'type' ])
          done()
        })
      }
    })
  })
})
