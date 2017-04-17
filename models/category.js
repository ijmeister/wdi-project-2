const mongoose = require('mongoose')

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Sub_Category'
  }]
})

var Category = mongoose.model('Category', CategorySchema)

module.exports = Category
