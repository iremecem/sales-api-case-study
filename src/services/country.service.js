const Country = require('../models/country');

module.exports.getCountries = async (region) => {
    if (region) {
        const countries = await Country.find({ region: region }, '-_id');
        return countries;
    } else {
        const countries = await Country.find({}, '-_id');
        return countries;
    }
};
