const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name: fullName,
      email,
      password: hashedPassword,
      role: 'USER',
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await sendEmail(email, 'Verification Code', `Your code is: ${token}`);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verify = (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '72h' });

    res.cookie('token', authToken, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
    res.json({ message: 'Verification successful', token: authToken });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
