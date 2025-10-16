const express = require('express');
const passport = require('passport');
require('../config/passport-setup');
const { protect } = require('../middelwares/authMiddelware')

const { registerUser, loginUser, getUserInfo, updateUser, updateProfilePhoto } = require('../controllers/authController');
const upload = require('../middelwares/uploadMiddleware');

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

router.put("/updateUser", protect, updateUser);

router.put("/updateProfilePhoto", protect, updateProfilePhoto);

router.post("/uploadImage", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "no file uploads" })
    }

    const imageurl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

res.status(200).json({ imageurl });
})

// Google OAuth: start auth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth: handle callback, issue JWT, and redirect to frontend
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: process.env.CLIENT_URL || '/' }),
  (req, res) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECURITY, { expiresIn: '1h' });
    const redirectUrl = (process.env.CLIENT_URL || 'http://localhost:5173') + `/?token=${token}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;