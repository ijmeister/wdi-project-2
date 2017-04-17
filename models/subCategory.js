const mongoose = require('mongoose')

var SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

var SubCategory = mongoose.model('Sub_Category', SubCategorySchema)

module.exports = SubCategory
