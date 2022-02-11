const express = require('express');
const mongoose = require('mongoose');

const ApiError = require('./src/utils/ApiError');
const logger = require('./src/utils/logger');
const { dbConfig } = require('./src/configs/db.config');

const countryRoutes = require('./src/routes/country.route');
const salesrepRoutes = require('./src/routes/salesrep.route');
const optimalRoutes = require('./src/routes/optimal.route');

const app = express();

mongoose.connect(dbConfig.url, {
    auth: {
        username: dbConfig.username,
        password: dbConfig.password,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', () => {
    logger.error('Database connection error');
    console.error.bind(console, 'connection error:');
});
db.once('open', () => {
    logger.info('Database connected');
});

app.use('/country', countryRoutes);
app.use('/salesrep', salesrepRoutes);
app.use('/optimal', optimalRoutes);

app.all('*', (req, res, next) => {
    next(new ApiError('Requested URL Is Not Found', 404));
});

app.use((err, req, res, next) => {
    console.log(err.message);
    const { statusCode = 500 } = err;
    if (!err.message | (statusCode === 500))
        err.message = 'Internal Server Error';
    logger.error(err.message);
    res.status(statusCode).send(new ApiError(err.message, statusCode));
});

const port = 3000;
app.listen(port, () => {
    logger.info(`Serving on port ${port}`);
});

module.exports = { app };
