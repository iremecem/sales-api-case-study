const axios = require('axios');
const {
    calculateOptimalSalesRepRoaster,
} = require('../helpers/optimal.helper');

module.exports.calculateOptimalSalesRepRoaster = async () => {
    const countriesReq = await axios.get('http://127.0.0.1:3000/country');
    const countries = countriesReq.data;
    const roaster = calculateOptimalSalesRepRoaster(countries);
    return roaster;
};
