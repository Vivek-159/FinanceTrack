const express = require('express');
const { protect } = require('../middelwares/authMiddelware');
const { getdashboardData } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', protect, getdashboardData);

module.exports = router;