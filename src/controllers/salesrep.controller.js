const salesrepService = require('../services/salesrep.service');
const logger = require('../utils/logger');

// GET '/salesrep'
module.exports.getSalesreps = async (req, res) => {
    const salesreps = await salesrepService.getSalesreps();
    logger.info('SalesRep assignments have been calculated successfully');
    res.send(salesreps);
};
