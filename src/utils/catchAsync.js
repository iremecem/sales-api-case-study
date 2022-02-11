/**
 * This function returns the callback function when the promise is resolved
 * When there is an error, it passes the error to the next error handling middleware
 *
 * @param {function} func: The function to call
 * @returns {function} : the function passed as parameter
 */
module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
};
