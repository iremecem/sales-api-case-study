/**
 * Takes an array of objects and a property f as parameter
 * and returns the grouped array by the value f
 *
 * @param {Array} x
 * @param {String} f
 * @returns {Array} The grouped array by the value f
 */
module.exports.groupBy = (x, f) =>
    x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});
