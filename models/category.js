const mongoose = require('mongoose')

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Sub_Category'
  }],
  belongs_to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

var Category = mongoose.model('Category', CategorySchema)

module.exports = Category
