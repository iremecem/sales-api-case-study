const express = require('express');
const router = express.Router();
const optimalController = require('../controllers/optimal.controller');
const catchAsync = require('../utils/catchAsync');

router.route('/').get(catchAsync(optimalController.getOptimalRoasters));

module.exports = router;
