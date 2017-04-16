var mongoose = require('mongoose')

var UserInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  targetExpense: {
    type: Number,
    required: true,
    min: 0
  },
  // day of month
  expenseCycle: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  belongs_to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

// assign a function to the "statics" object of our animalSchema
UserInfoSchema.statics.findByUserId = function (userId, cb) {
  return this.findOne({ belongs_to: userId }, cb).populate('belongs_to')
}

var UserInfo = mongoose.model('User_Info', UserInfoSchema)

module.exports = UserInfo
