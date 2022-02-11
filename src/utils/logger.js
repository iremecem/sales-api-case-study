const { createLogger, transports, config, format } = require('winston');
const { combine, timestamp, printf, colorize, align } = format;

/**
 * Logger to use in the application for logging the events
 */
const logger = createLogger({
    levels: config.syslog.levels,
    defaultMeta: { component: 'api-service' },
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' }),
    ],
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app-error.log', level: 'error' }),
    ],
});

module.exports = logger;
