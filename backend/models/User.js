const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  cart: [{ product: { type: Object, required: true }, quantity: { type: Number, required: true } }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
})
// const User = mongoose.model('User', userSchema);

userSchema.statics.findByCredentials = async (email, password) => {
  const foundUser = await mongoose.model('User', userSchema).findOne({ email });
  if (!foundUser) {
    throw new Error('incorrect email or passord')
  };

  const passwordMatch = bcrypt.compareSync(password, foundUser.password);
  if (!passwordMatch) {
    throw new Error('incorrect email or password');
  } else {
    return foundUser;
  }
}

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
}

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err)
      } else {
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            return next(err);
          } else {
            user.password = hash;
            next();
          }
        })
      }
    })
  }
})

userSchema.pre('remove', function (next) {
  this.model('Order').remove({ owner: this._id }, next);
})

module.exports = mongoose.model('User', userSchema);