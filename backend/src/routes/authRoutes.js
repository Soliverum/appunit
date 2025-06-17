const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust path if necessary
const bcrypt = require('bcrypt'); // Require bcrypt
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // Include name and optional role

    // Basic validation
    if (!name || !email || !password) { // Name, email, and password are required
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Password length validation (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Basic email format validation (can be enhanced)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password, // Mongoose pre-save hook handles hashing
      name, // Include name
      roles: [role || 'user'] // Use provided role or default to 'user'
    });

    await user.save();

    // Generate JWT token
    const payload = { userId: user._id, roles: user.roles };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }); // Configurable expiration

    // Prepare user object for response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse }); // Return token and user object


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password); // Assuming a comparePassword method on the User model
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { userId: user._id, roles: user.roles }; // Payload can include user ID and roles
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use a secure secret and set expiration

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      // Generate a secure token
      const token = crypto.randomBytes(20).toString('hex');

      // Set token and expiration on user object
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour (3600000 ms)

      await user.save();

      // Send email with reset link
      const transporter = nodemailer.createTransport({
        // Configure your email service provider details here
        // Example for Gmail:
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app password
        },
      });

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'AppUnit Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://${req.headers.host}/reset-password?token=${token}\n\n` + // Use req.headers.host for dynamic host
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);
    }

    // Always respond with a success message for security reasons
    res.status(200).json({ message: 'Password reset email sent (if user exists)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during forgot password request' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by token and check expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Basic password length validation
    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    // Update password and clear token fields
 user.password = newPassword; // Assuming your User model has a pre-save hook to hash the password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset.' });
  }
});
module.exports = router;