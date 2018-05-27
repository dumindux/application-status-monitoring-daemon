const request = require('request');
const logger = require('../utils/logger');

function getStatusOfApplication(application) {
    return new Promise((resolve) => {
        const errorHandler = (err) => {
            logger.error(`error while connecting to ${application.name}`);
            logger.error(err);
            resolve({
                tags: {
                    monitoringServer: global.config.application.serverName,
                    name: application.name,
                    type: 'http'
                },
                fields: {
                    status: 'offline'
                }
            });
        };

        const connection = request({ url: application.url, headers: application.headers }, (_, response, body) => {
            if (!response || response.statusCode !== 200 || (application.containsText && !JSON.stringify(body).includes(application.containsText))) {
                errorHandler();
                return;
            }

            logger.info(`successfully connected to ${application.name}`);
            resolve({
                tags: {
                    monitoringServer: global.config.application.serverName,
                    name: application.name,
                    type: 'http'
                },
                fields: {
                    status: 'online'
                }
            });
        });

        connection.on('error', errorHandler);
    });
}

module.exports = { getStatusOfApplication };
