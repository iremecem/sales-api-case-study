const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');
const catchAsync = require('../utils/catchAsync');

router.route('/').get(
    catchAsync(countryController.getCountries)
);

module.exports = router;
