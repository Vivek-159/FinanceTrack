const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECURITY, { expiresIn: "1h" });
}

exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileimageurl } = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({message : "All field are required..!"});
    }

    try {
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message : "already an member "});
        }

        const user = await User.create({
            fullName,email,password,profileimageurl
        });

        res.status(201).json({
            id:user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({message: "error accure registering user", error: err.message})
    }
}
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({message : "all field are required.."})
    }
    try {
        const user = await User.findOne({ email });
        if(!user || !(await user.comparepassword(password))){
            return res.status(400).json({message : "invalid credintials "})
        }

        res.status(200).json({
            id:user._id,
            user,
            token: generateToken(user._id),
        })
    } catch (err) {
        res.status(500).json({message: "error accure Login", error: err.message})
    }
}
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({message: "No user found"})
        }
        return res.status(200).json(user);

    } catch (err) {
        res.status(500).json({message: "error accure Finding", error: err.message})
    }
}

exports.updateUser = async (req, res) => {
    const { fullName } = req.body;

    if (!fullName) {
        return res.status(400).json({ message: "Full name is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { fullName },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message });
    }
}

exports.updateProfilePhoto = async (req, res) => {
    const { profileimageurl } = req.body;

    if (!profileimageurl) {
        return res.status(400).json({ message: "Profile image URL is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profileimageurl },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile photo updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile photo", error: err.message });
    }
}
