const express = require('express');
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

module.exports = router;