const express = require('express');
const router = express.Router();
const salesrepController = require('../controllers/salesrep.controller');
const catchAsync = require('../utils/catchAsync');

router.route('/').get(catchAsync(salesrepController.getSalesreps));

module.exports = router;