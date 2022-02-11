const axios = require('axios');
const { calculateSalesReps } = require('../helpers/salesrep.helper');

module.exports.getSalesreps = async () => {
    const countriesReq = await axios.get('http://127.0.0.1:3000/country');
    const countries = countriesReq.data;
    const salesReps = calculateSalesReps(countries);
    return salesReps;
};
