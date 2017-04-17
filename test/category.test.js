require('dotenv').config()
const mongoose = require('mongoose')
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const dbURI = process.env.MONGO_DB_URI_TEST
const clearDB = require('mocha-mongoose')(dbURI)
const assert = require('chai').assert

describe('Creating a category with sub categories', function () {
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
        Category.create({
          name: 'Bills',
          subCategories: [ subCat._id ]
        }, (err, cat) => {
          if (err) {
            return done(err)
          } else {
            Category.find({}, (err, cats) => {
              if (err) return done(err)
              assert.strictEqual(cats[0].name, 'Bills')
              assert.strictEqual(cats[0].subCategories[0].name, 'Telephone Bills')
              done()
            }).populate('subCategories')
          }
        })
      }
    })
  })
})
