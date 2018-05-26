const request = require('request');
const logger = require('../utils/logger');

function getStatusOfApplication(application) {
    return new Promise((resolve) => {
        const errorHandler = (err) => {
            logger.error(`error while connecting to ${application.name}`);
            logger.error(err);
            resolve({
                monitoringServer: global.config.application.serverName,
                name: application.name,
                status: 'offline',
                type: 'http'
            });
        };

        const connection = request({ url: application.url, headers: application.headers }, (_, response, body) => {
            if (!response || response.statusCode !== 200 || (application.containsText && !JSON.stringify(body).includes(application.containsText))) {
                errorHandler();
                return;
            }

            logger.info(`successfully connected to ${application.name}`);
            resolve({
                monitoringServer: global.config.application.serverName,
                name: application.name,
                status: 'online',
                type: 'http'
            });
        });

        connection.on('error', errorHandler);
    });
}

module.exports = { getStatusOfApplication };
