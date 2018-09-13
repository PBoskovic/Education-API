const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { emailRegExp } = require('../lib/misc');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegExp, 'Invalid email address'],
    required: 'Please enter a valid email address',
  },

  // Temporarily set to String
  // Will be a certain ID reference when new models are introduced
  school: String,
  schoolClass: String,
  phoneNumber: String,
  password: {
    type: String,
    required: true,
    select: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetToken: String,
}, {
  timestamps: true,
});

// Using pre save hook to hash password before saving the new User
UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = {
  User: mongoose.model('User', UserSchema),
};
