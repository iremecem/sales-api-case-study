const optimalService = require('../services/optimal.service');
const logger = require('../utils/logger');

// GET '/optimal'
module.exports.getOptimalRoasters = async (req, res) => {
    const optimalRepsRoaster = await optimalService.calculateOptimalSalesRepRoaster();
    logger.info('Optimal roasters have been calculated successfully');
    res.send(optimalRepsRoaster);
}