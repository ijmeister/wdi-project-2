const mongoose = require('mongoose')

var TransactionSchema = new mongoose.Schema({
  inAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  outAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  in_account: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Sub_Category',
    required: true
  }
})

var Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction
