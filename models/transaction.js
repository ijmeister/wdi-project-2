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
    type: String
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

TransactionSchema.statics.getAccountsBalance = function (accountIds, next) {
  Transaction.aggregate([
    {
      $match: {
        in_account: { $in: accountIds }
      }
    },
    { $group: {
      _id: '$in_account',
      balanceIn: { $sum: '$inAmount' },
      balanceOut: { $sum: '$outAmount' }
    }}
  ], function (err, result) {
    if (err) { return false }
    // console.log(JSON.stringify(result))
    next(null, result)
  })
}

var Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction
