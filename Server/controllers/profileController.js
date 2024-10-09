const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getUserDetails = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(403).json({ error: "Need to Login" });
    }

    const uDetails = await User.findById(user.userId).lean();
    if (!uDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    delete uDetails.password;
    delete uDetails.resetPasswordTokenHash;

    return res.status(200).json(uDetails);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token. Need to Login" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(403).json({ error: "Need to Login" });
    }

    const uDetails = await User.findById(user.userId);
    const { name, number } = req.body;

    uDetails.uname = name;
    uDetails.number = number;

    await uDetails.save();
    return res.status(200).json({ message: "details Updated" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.destroy = async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User not found.`,
        });
      } else {
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
          domain: process.env.COOKIE_DOMAIN || undefined
        };
      
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        return res.status(200).send({
          message: "User deleted successfully!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message,
      });
    });
};
