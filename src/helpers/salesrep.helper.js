const { groupBy } = require('../utils/groupBy');
const ApiError = require('../utils/apiError');

/**
 * Calculates minimum and maximum values for sale reps required to cover all countries in a region
 *
 * Requirements:
 * Each region should have at least 1 representative
 * Each representative should have at least 3 countries and at most 7 countries assigned to them
 * Each country should be assigned to one and only one sales representative
 *
 * @param {Array} countries : Array of objects representing countries
 * @returns {Object} salesReps : Object containing the minimum and maximum
 *                  number of sales reps required to cover all countries in a region
 */
const calculateSalesReps = (countries) => {
    // Group countries by region
    const groupedCountries = groupBy(countries, (country) => country.region);

    const salesReps = [];

    // For each entry in groupedCountries,
    // calculates minimum and maximum values for
    // sales reps required to cover all countries in a region
    Object.entries(groupedCountries).forEach(([key, val]) => {
        const countryCount = val.length;

        // If a region has 0 countries, which is impossible, there should be an error
        if (countryCount === 0) {
            throw new ApiError('Interval Server Error', 500);
        }
        const minSalesRep = calculateMinSalesReps(countryCount);
        const maxSalesRep = calculateMaxSalesReps(countryCount);

        const salesRep = {
            region: key,
            minSalesRep: minSalesRep,
            maxSalesRep: maxSalesRep,
        };
        salesReps.push(salesRep);
    });

    return salesReps;
};

/**
 * Takes countryCount as parameter and calculates the minimum number of sales reps
 *
 * @param {Number} countryCount : Number of countries in a region
 * @returns {Number} minSalesRep : Minimum umber of sales reps required to cover all countries in a region
 */
const calculateMinSalesReps = (countryCount) => {
    const MAX_COUNTRY_FOR_REP = 7;

    // if the country count is divisible by MAX_COUNTRY_FOR_REP, the division will
    // result in a whole number, which is the minimum number of representatives required
    // otherwise, the minimum number of representatives required is division + 1,
    // because the remainders would need a new representative. even if the remainder
    // is less then 3, countries that are assigned to other representatives would
    // compensate for missing countries without breaking the min-max requirements
    const minSalesRep =
        countryCount % MAX_COUNTRY_FOR_REP === 0
            ? Math.floor(countryCount / MAX_COUNTRY_FOR_REP)
            : Math.floor(countryCount / MAX_COUNTRY_FOR_REP) + 1;

    return minSalesRep;
};

/**
 * Takes countryCount as parameter and calculates the maximum number of sales reps
 *
 * @param {Number} countryCount : Number of countries in a region
 * @returns {Number} maxSalesRep : Maximum number of sales reps required to cover all countries in a region
 */
const calculateMaxSalesReps = (countryCount) => {
    const MIN_COUNTRY_FOR_REP = 3;

    // if there are less then 3 countries in a region, there should be 1 representative
    // otherwise, if there the remainder is larger than 0, those countries would be
    // randomly assigned to existing representatives without breaking the min-max requirements
    const maxSalesRep =
        countryCount >= 3 ? Math.floor(countryCount / MIN_COUNTRY_FOR_REP) : 1;

    return maxSalesRep;
};

module.exports = {
    calculateSalesReps,
    calculateMinSalesReps,
    calculateMaxSalesReps,
};
