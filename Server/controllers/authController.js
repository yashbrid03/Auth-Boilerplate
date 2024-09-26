const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const sendEmail = require('../config/email');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const user = new User({ email, password, verificationToken });
    await user.save();

    sendEmail(email, 'Verify Your Email', `Click here to verify: ${process.env.FRONTEND_URL}/api/auth/verify-email/${verificationToken}`);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendVerificationEmail = async (req,res) =>{
  try{
    const email = req.body.email;
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({error:'User not registered'})
    }
    if(user.isVerified === true){
      return res.status(401).json({ error: 'User already Verified' });
    }
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    sendEmail(email, 'Verify Your Email', `Click here to verify: ${process.env.FRONTEND_URL}/api/auth/verify-email/${verificationToken}`);

  }catch(error){

  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie(String(user.id),accessToken, {
      path:"/",
      expires : new Date(Date.now()+1000*30),
      httpOnly:true,
      sameSite: "lax"
    })
    res.status(200).json("Logged in successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    if(user.isVerified === true){
      return res.status(401).json({ error: 'User already Verified' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired verification token' });
  }
};