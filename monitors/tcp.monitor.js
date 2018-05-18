const net = require('net');
const logger = require('../utils/logger');

function getStatusOfApplication(application) {
    return new Promise((resolve) => {
        const connection = net.connect({ host: application.host, port: application.port }, () => {
            connection.destroy();
            logger.info(`successfully connected to ${application.name}`);
            resolve({
                monitoringServer: global.config.serverName,
                name: application.name,
                status: 'online',
                type: 'tcp'
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
                type: 'tcp'
            });
        });
    });
}

module.exports = { getStatusOfApplication };
