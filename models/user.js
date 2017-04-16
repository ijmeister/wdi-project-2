const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return validator.isEmail(v)
      },
      message: '{VALUE} is not a valid email!'
    },
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  }
})

UserSchema.plugin(uniqueValidator)

UserSchema.statics.findByEmail = function (email, next) {
  this.findOne({
    email: email
  }, function (err, foundUser) {
    if (err) return false
    next(null, foundUser)
  })
}

UserSchema.methods.validPassword = function (password) {
  // Compare is a bcrypt method that will return a boolean,
  return bcrypt.compareSync(password, this.password)
}

// ...
UserSchema.pre('save', function (next) {
  var user = this

   // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

   // hash the password
  var hash = bcrypt.hashSync(user.password, 10)

   // Override the cleartext password with the hashed one
  user.password = hash
  next()
})

UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    // delete the password from the JSON data, and return
    delete ret.password
    return ret
  }
}

var User = mongoose.model('User', UserSchema)

module.exports = User
