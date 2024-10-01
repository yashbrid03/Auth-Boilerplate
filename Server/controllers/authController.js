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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 1 * 30 * 1000 // 30 sec
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json("Logged in successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    console.log("hello")
    const  refreshToken  = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("decoded :",refreshToken)
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 30 * 1000 //30 secs
    });

    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
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

exports.getUser = async (req,res) =>{
  try{
    // console.log(res.header)
    const token = req.cookies.accessToken;
    console.log("inside getauth")
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Need to Login' });
      }
console.log({user})
      res.status(200).json({user:user})
      
      // next();
    });
    // res.json({user :req.user})
  }catch(error){
    res.status(400).json({ error: 'Need Login' });
  }
}