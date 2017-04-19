require('dotenv').config()
const mongoose = require('mongoose')
const dbURI = process.env.MONGO_DB_URI_TEST
const clearDB = require('mocha-mongoose')(dbURI)
const assert = require('chai').assert

// models
const SubCategory = require('../models/subCategory')
const Category = require('../models/category')
const Transaction = require('../models/transaction')
const Account = require('../models/account')
const User = require('../models/user')

describe('CRUD on Category Model', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
    mongoose.Promise = global.Promise
  })

  it('should create successfully with a subcategoryid and accountid included', function (done) {
    SubCategory.create({
      name: 'Telephone Bills'
    }, function (err, subCat) {
      if (err) {
        return done(err)
      } else {
        User.create({
          email: 'test@test.co',
          password: 'password'
        }, (err, newUser) => {
          if (err) return done(err)
          Category.create({
            name: 'Bills',
            subCategories: [ subCat._id ],
            belongs_to: newUser._id
          }, (err, cat) => {
            if (err) {
              return done(err)
            } else {
              Account.create({
                name: 'DBS Savings',
                type: 'Savings',
                belongs_to: newUser._id
              }, (err, acc) => {
                if (err) {
                  return done(err)
                } else {
                  Transaction.create({
                    inAmount: 11,
                    comment: 'my bill',
                    date: new Date(2017, 4, 15),
                    in_account: acc._id,
                    subcategory: subCat._id
                  }, (err, trans) => {
                    if (err) done(err)
                    Transaction.find({}, (err, trans) => {
                      if (err) return done(err)
                      assert.strictEqual(trans[0].comment, 'my bill')
                      assert.strictEqual(trans[0].in_account.type, 'Savings')
                      assert.deepEqual(trans[0].subcategory._id, subCat._id)
                      done()
                    }).populate('in_account subcategory')
                  })
                }
              })
            }
          })
        })
      }
    })
  })

  it('Getting the balance of each account', function (done) {
    SubCategory.create({
      name: 'Telephone Bills'
    }, function (err, subCat) {
      if (err) {
        return done(err)
      } else {
        User.create({
          email: 'test@test.co',
          password: 'password'
        }, (err, newUser) => {
          if (err) return done(err)
          Category.create({
            name: 'Bills',
            subCategories: [ subCat._id ],
            belongs_to: newUser._id
          }, (err, cat) => {
            if (err) {
              return done(err)
            } else {
              Account.create({
                name: 'DBS Savings',
                type: 'Savings',
                belongs_to: newUser._id
              }, (err, acc) => {
                if (err) {
                  return done(err)
                } else {
                  Transaction.create({
                    outAmount: 50,
                    comment: 'my bill',
                    date: new Date(2017, 4, 15),
                    in_account: acc._id,
                    subcategory: subCat._id
                  }, (err, trans) => {
                    if (err) done(err)
                    Transaction.create({
                      outAmount: 50,
                      comment: 'my bill',
                      date: new Date(2017, 4, 15),
                      in_account: acc._id,
                      subcategory: subCat._id
                    }, (err, trans) => {
                      if (err) done(err)
                      Transaction.create({
                        inAmount: 10,
                        comment: 'bank interest',
                        date: new Date(2017, 4, 15),
                        in_account: acc._id,
                        subcategory: subCat._id
                      }, (err, trans) => {
                        if (err) done(err)
                        Transaction.aggregate([
                          {
                            $match: {
                              in_account: acc._id
                            }
                          },
                          { $group: {
                            _id: '$in_account',
                            balanceIn: { $sum: '$inAmount' },
                            balanceOut: { $sum: '$outAmount' }
                          }}
                        ], function (err, result) {
                          if (err) {
                            done(err)
                          }
                          console.log(JSON.stringify(result))
                          done()
                        })
                      })
                    })
                  })
                }
              })
            }
          })
        })
      }
    })
  })

  it('Should error on bad inputs', function (done) {
    Transaction.create({
      inAmount: 'bad',
      date: 'bad'
    }, (err, trans) => {
      assert.isOk(err.errors[ 'inAmount' ])
      // assert.isOk(err.errors[ 'comment' ])
      assert.isOk(err.errors[ 'date' ])
      assert.isOk(err.errors[ 'in_account' ])
      assert.isOk(err.errors[ 'subcategory' ])
      done()
    })
  })
})
