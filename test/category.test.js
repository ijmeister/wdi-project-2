require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/user')
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

  it('should create successfully with a subcategory and userid included', function (done) {
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
              Category.find({}, (err, cats) => {
                if (err) return done(err)
                assert.strictEqual(cats[0].name, 'Bills')
                assert.strictEqual(cats[0].subCategories[0].name, 'Telephone Bills')
                assert.strictEqual(cats[0].belongs_to.email, 'test@test.co')
                done()
              }).populate('subCategories belongs_to')
            }
          })
        })
      }
    })
  })

  it('should be able add a new subcategory', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) return done(err)
        SubCategory.create({
          name: 'Telephone Bills'
        }, function (err, subCat) {
          if (err) {
            return done(err)
          } else {
            Category.create({
              name: 'Bills',
              belongs_to: newUser._id
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
  })

  it('Can update category name', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) return done(err)
      Category.create({
        name: 'Bills',
        belongs_to: newUser._id
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

  it('When trying to edit a category with invalid id should give an error', function (done) {
    Category.findByIdAndUpdate('1', {name: 'Food'}, (err, cat) => {
      assert.isOk(err)
      done()
    })
  })

  it('Delete category will delete the subcategories', function (done) {
    User.create({
      email: 'test@test.co',
      password: 'password'
    }, (err, newUser) => {
      if (err) return done(err)
      SubCategory.create({
        name: 'Telephone Bills'
      }, function (err, subCat1) {
        if (err) done(err)
        SubCategory.create({
          name: 'Water Bills'
        }, function (err, subCat2) {
          if (err) done(err)
          SubCategory.create({
            name: 'Lunch'
          }, function (err, subCat3) {
            if (err) done(err)
            Category.create({
              name: 'Bills',
              belongs_to: newUser._id,
              subCategories: [ subCat1._id, subCat2._id ]
            }, (err, cat) => {
              if (err) done(err)
              SubCategory.count({}, (err, count) => {
                if(err) done(err)
                console.log(count)
                cat.subCategories.forEach((subcatId) => {
                  // console.log(subcat)
                  SubCategory.findByIdAndRemove(subcatId, (err, subcat) => {
                    console.log('removing subCatId: ' + subcat._id)
                    if(err) done(err)
                  })
                })
                SubCategory.count({}, (err, count) => {
                  if(err) done(err)
                  assert.strictEqual(count,1)
                  done()
                })
              })
            })
            // console.log(subCat1)
            // console.log(subCat2)
            // console.log(subCat3)
            // console.log(newUser)
            // done()
          })
        })
      })
      // Category.remove({
      //
      // }, (err, cat) => {
      //   assert.isOk(err)
      //   done()
      // })
    })
  })
})
