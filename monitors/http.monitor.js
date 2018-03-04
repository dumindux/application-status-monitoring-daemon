const request = require('request');
const logger = require('../utils/logger');

function getStatusOfApplication(application) {
    return new Promise((resolve) => {
        const connection = request({ url: application.url }, () => {
            connection.destroy();
            logger.info(`successfully connected to ${application.name}`);
            resolve({
                monitoringServer: global.config.serverName,
                name: application.name,
                status: 'online',
                type: 'http'
            });
        });

        connection.on('error', (err) => {
            connection.destroy();
            logger.error(`error while connecting to ${application.name}`);
            logger.error(err);
            resolve({
                monitoringServer: global.config.serverName,
                name: application.name,
                status: 'offline',
                type: 'http'
            });
        });
    });
}

module.exports = { getStatusOfApplication };
