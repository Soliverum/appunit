const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  roles: {
    type: [String],
    default: ['user'],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add an index to the email field for faster lookups
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);