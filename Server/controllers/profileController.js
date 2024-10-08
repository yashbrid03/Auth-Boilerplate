const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getUserDetails = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
          return res.status(403).json({ error: "Need to Login" });
        }
        
        console.log("User from token:", user);
    
        const uDetails = await User.findById(user.userId).lean();
        if (!uDetails) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Remove the password field
        delete uDetails.password;
        delete uDetails.resetPasswordTokenHash;
    
        console.log("User details (without password):", uDetails);
        res.status(200).json(uDetails);
      } catch (error) {
        console.error("Error in getUserDetails:", error);
        if (error.name === 'JsonWebTokenError') {
          return res.status(403).json({ error: "Invalid token. Need to Login" });
        }
        res.status(500).json({ error: "Internal server error" });
      }
};
  
exports.updateUserDetails = async (req,res) =>{
    try{
        const token = req.cookies.accessToken;
    
        // Verify JWT token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
        return res.status(403).json({ error: "Need to Login" });
        }

        // Fetch user from database
        const uDetails = await User.findById(user.userId);
        const {name,number} = req.body;

        // console.log(name +" "+number)

        uDetails.uname = name;
        uDetails.number = number;

        await uDetails.save();
        return res.status(200).json({message:"details Updated"})
    }catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.destroy = async (req, res) => {
  
  await User.findByIdAndDelete(req.params.id).then(data => {
      if (!data) {
        res.status(404).send({
          message: `User not found.`
        });
      } else {
        res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
        res.status(200).send({
          message: "User deleted successfully!"
        });
      }
  }).catch(err => {
      res.status(500).send({
        message: err.message
      });
  });
};
