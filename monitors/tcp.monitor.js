const net = require('net');
const logger = require('../utils/logger');

function getStatusOfApplication(application) {
    return new Promise((resolve) => {
        const connection = net.connect({ host: application.host, port: application.port }, () => {
            connection.destroy();
            logger.info(`successfully connected to ${application.name}`);
            resolve({
                tags: {
                    monitoringServer: global.config.application.serverName,
                    name: application.name,
                    type: 'tcp'
                },
                fields: {
                    status: 'online',
                    statusValue: 1
                }
            });
        });

        connection.on('error', (err) => {
            connection.destroy();
            logger.error(`error while connecting to ${application.name}`);
            logger.error(err);
            resolve({
                tags: {
                    monitoringServer: global.config.application.serverName,
                    name: application.name,
                    type: 'tcp'
                },
                fields: {
                    status: 'offline',
                    statusValue: 0
                }
            });
        });
    });
}

module.exports = { getStatusOfApplication };
