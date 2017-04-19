const mongoose = require('mongoose')

// set available account types
// 2 for now, can be extensible
const accountTypes = [ 'Savings', 'Credit Card' ]

var AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: accountTypes
  },
  belongs_to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

var Account = mongoose.model('Account', AccountSchema)

module.exports = Account
