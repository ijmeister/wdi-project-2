require('dotenv').config()
const mongoose = require('mongoose')
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const dbURI = process.env.MONGO_DB_URI_TEST
const clearDB = require('mocha-mongoose')(dbURI)
const assert = require('chai').assert

describe('CRUD on Category Model', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done()
    mongoose.connect(dbURI, done)
    mongoose.Promise = global.Promise
  })

  it('should create successfully with a subcategory included', function (done) {
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

  it('should be able add a new subcategory', function (done) {
    SubCategory.create({
      name: 'Telephone Bills'
    }, function (err, subCat) {
      if (err) {
        return done(err)
      } else {
        Category.create({
          name: 'Bills'
          // subCategories: [ subCat._id ]
        }, (err, cat) => {
          if (err) {
            return done(err)
          } else {
            Category.findById(cat._id, (err, foundCat) => {
              if (err) return done(err)
              foundCat.subCategories.push(subCat._id)
              foundCat.save((err, savedCat) => {
                if (err) return done(err)
                Category.findById(cat._id, (err, foundCat) => {
                  if (err) return done(err)
                  assert.strictEqual(foundCat.subCategories[0].name, 'Telephone Bills')
                  done()
                }).populate('subCategories')
              })
            })
          }
        })
      }
    })
  })

  it('Can update category name', function (done) {
    Category.create({
      name: 'Bills'
    }, (err, cat) => {
      if (err) {
        return done(err)
      } else {
        Category.findByIdAndUpdate(cat._id, {name: 'Food'}, (err, cat) => {
          if (err) return done(err)
          Category.findById(cat._id, (err, cat) => {
            if (err) return done(err)
            assert.strictEqual(cat.name, 'Food')
            done()
          })
        })
      }
    })
  })
})
