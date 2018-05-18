const Logger = require('./logger.util');
const loggerConfig = require('./../../config/logger.config.json');

module.exports = new Logger({
    name: loggerConfig.logHeader,
    streams: [
        {
            level: 'trace',
            stream: process.stdout
        }
    ]
});
