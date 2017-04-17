require('dotenv').config()
const mongoose = require('mongoose')
const SubCategory = require('../models/subCategory')
const dbURI = process.env.MONGO_DB_URI_TEST
const clearDB = require('mocha-mongoose')(dbURI)
const assert = require('chai').assert

describe('Creating a subcategory', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
    mongoose.Promise = global.Promise
  })

  it('should create successfully', function (done) {
    SubCategory.create({
      name: 'Telephone Bills'
    }, function (err, subCat) {
      if (err) {
        return done(err)
      } else {
        done()
      }
    })
  })
})
