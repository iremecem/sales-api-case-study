const { groupBy } = require('../utils/groupBy');
const { calculateMinSalesReps } = require('./salesrep.helper');

/**
 * Takes region, country list, country count and sales rep count
 * as parameter and calculates the optimal sales rep roaster assignments
 * for a region with an even workload
 *
 * @param {String} region : The region of the countries
 * @param {Array} countryList : Array of objects representing countries
 * @param {Number} countryCount : Number of countries in the region
 * @param {Number} salesRepCount : Number of sales reps required to cover all countries
 * @returns {Array} roaster : Array of objects representing the roaster assignments
 */
const calculateOptimalForEvenWorkload = (
    region,
    countryList,
    countryCount,
    salesRepCount
) => {
    const roaster = [];
    const numCountriesInRoaster = Math.floor(countryCount / salesRepCount);

    // Assign the number of countries in a roaster to the sales rep equally
    // [0, numCountriesInRoaster), [numCountriesInRoaster, 2 * numCountriesInRoaster), ...
    let countryIndex = 0;
    for (let i = 0; i < salesRepCount; i++) {
        const salesRepRoaster = {
            region: region,
            countryList: countryList.slice(
                countryIndex,
                countryIndex + numCountriesInRoaster
            ),
            countryCount: numCountriesInRoaster,
        };
        roaster.push(salesRepRoaster);
        countryIndex += numCountriesInRoaster;
    }
    return roaster;
};

/**
 * Takes region, country list, country count and sales rep count
 * as parameter and calculates the optimal sales rep roaster assignments
 * for a region with an non even workload
 *
 * @param {String} region : The region of the countries
 * @param {Array} countryList : Array of objects representing countries
 * @param {Number} countryCount : Number of countries in the region
 * @param {Number} salesRepCount : Number of sales reps required to cover all countries
 * @returns {Array} roaster : Array of objects representing the roaster assignments
 */
const calculateOptimalForNonEvenWorkload = (
    region,
    countryList,
    countryCount,
    salesRepCount
) => {
    const roaster = [];

    // (⌊countryCount/salesRepCount⌋+1) countries should be assigned to first
    // (⌊countryCount−⌊countryCount/salesRepCount⌋*salesRepCount) salesreps
    const moreWorkloadSalesRepCount =
        countryCount - Math.floor(countryCount / salesRepCount) * salesRepCount;
    const numCountriesInRoasterMore =
        Math.floor(countryCount / salesRepCount) + 1;

    const { roaster: moreRoaster, countryIndex } =
        calculateRoasterForMoreWorkload(
            region,
            countryList,
            numCountriesInRoasterMore,
            moreWorkloadSalesRepCount
        );

    roaster.push(...moreRoaster);

    // ⌊countryCount/salesRepCount⌋ countries should be assigned to remaining salesreps
    const lessWorkloadSalesRepCount = salesRepCount - moreWorkloadSalesRepCount;
    const numCountriesInRoasterLess = Math.floor(countryCount / salesRepCount);

    const lessRoaster = calculateRoasterForLessWorkload(
        region,
        countryList,
        numCountriesInRoasterLess,
        lessWorkloadSalesRepCount,
        countryIndex
    );

    roaster.push(...lessRoaster);

    return roaster;
};

/**
 * Takes region, country list, num countries in roaster and sales rep count
 * as parameter and calculates the optimal sales rep roaster assignments
 * for a region with more workload
 *
 * @param {String} region : The region of the countries
 * @param {Array} countryList : Array of objects representing countries
 * @param {Number} numCountriesInRoasterMore : Number of countries in roaster
 * @param {Number} moreWorkloadSalesRepCount : Number of sales reps required to cover all countries
 * @returns {Array} roaster : Array of objects representing the roaster assignments
 * @returns {Number} countryIndex : The index of the countryList array where the country is yet to be assigned
 */
const calculateRoasterForMoreWorkload = (
    region,
    countryList,
    numCountriesInRoasterMore,
    moreWorkloadSalesRepCount
) => {
    const roaster = [];
    let countryIndex = 0;
    for (let i = 0; i < moreWorkloadSalesRepCount; i++) {
        const salesRepRoaster = {
            region: region,
            countryList: countryList.slice(
                countryIndex,
                countryIndex + numCountriesInRoasterMore
            ),
            countryCount: numCountriesInRoasterMore,
        };
        roaster.push(salesRepRoaster);
        countryIndex += numCountriesInRoasterMore;
    }
    return { roaster, countryIndex };
};

/**
 * Takes region, country list, num countries in roaster and sales rep count
 * as parameter and calculates the optimal sales rep roaster assignments
 * for a region with less workload
 *
 * @param {String} region : The region of the countries
 * @param {Array} countryList : Array of objects representing countries
 * @param {Number} numCountriesInRoasterLess : Number of countries in roaster
 * @param {Number} lessWorkloadSalesRepCount : Number of sales reps required to cover all countries
 * @returns {Array} roaster : Array of objects representing the roaster assignments
 */
const calculateRoasterForLessWorkload = (
    region,
    countryList,
    numCountriesInRoasterLess,
    lessWorkloadSalesRepCount,
    countryIndex
) => {
    const roaster = [];

    for (let i = 0; i < lessWorkloadSalesRepCount; i++) {
        const salesRepRoaster = {
            region: region,
            countryList: countryList.slice(
                countryIndex,
                countryIndex + numCountriesInRoasterLess
            ),
            countryCount: numCountriesInRoasterLess,
        };
        roaster.push(salesRepRoaster);
        countryIndex += numCountriesInRoasterLess;
    }

    return roaster;
};

/**
 * Takes countries as parameter and calculates the optimal sales rep roaster assignments
 *
 * Requirements:
 * The countries should be assigned to the minimum number of sales reps satisfying
 * the constraints stated in the salesrep endpoint.
 * The workload (i.e. the number of countries assigned to each team member) should be as close
 * to each other as possible in order to divide the work as equal as possible.
 *
 * @param {Array} countries : Array of objects representing countries
 * @returns {Array} roaster : Array of objects representing the roaster assignments
 */
module.exports.calculateOptimalSalesRepRoaster = (countries) => {
    const groupedCountries = groupBy(countries, (country) => country.region);
    const roaster = [];

    // For each entry in groupedCountries,
    // calculates minimum and maximum values for
    // sales reps required to cover all countries in a region
    Object.entries(groupedCountries).forEach(([key, val]) => {
        const region = key;
        const countryList = val.map((country) => country.name);

        const countryCount = countryList.length;
        // If a region has 0 countries, which is impossible, there should be an error
        if (countryCount === 0) {
            throw new ApiError('Interval Server Error', 500);
        }

        const salesRepCount = calculateMinSalesReps(countryCount);

        // If countryCount is divisible by salesRepCount, all workload
        // is equally distributed among sales reps
        if (countryCount % salesRepCount === 0) {
            const currentRoaster = calculateOptimalForEvenWorkload(
                region,
                countryList,
                countryCount,
                salesRepCount
            );
            roaster.push(...currentRoaster);
        }
        // If countryCount is not divisible by salesRepCount,
        // the workload is not equally distributed among sales reps
        // but the workload is distributed as close to each other as possible
        else {
            const currentRoaster = calculateOptimalForNonEvenWorkload(
                region,
                countryList,
                countryCount,
                salesRepCount
            );
            roaster.push(...currentRoaster);
        }
    });

    return roaster;
};
