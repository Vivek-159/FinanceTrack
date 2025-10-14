const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"not authorized"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECURITY);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(401).json({message:"not authorized, no token",err});
    }
}