const countryService = require('../services/country.service');
const logger = require('../utils/logger');

// GET '/country'
module.exports.getCountries = async (req, res) => {
    const { region } = req.query;
    const countries = await countryService.getCountries(region);
    logger.info('Countries have been retrieved successfully');
    res.send(countries)
};
