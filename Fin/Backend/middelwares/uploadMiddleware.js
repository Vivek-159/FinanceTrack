const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
        filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const filefilter = (req, file, cb) => {
    const allowedtypes = ['image/jpg', 'image/png', 'image.jpeg'];
    if (allowedtypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('only .jpg .jpeg .png is allowed'), false);
    }
}

const upload = multer({ storage, filefilter });

module.exports = upload;