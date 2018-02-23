const net = require('net');
const logger = require('../utils/logger');

function getStatusOfApplication(application) {
    return new Promise((resolve) => {
        const connection = net.connect({ host: application.host, port: application.port }, () => {
            connection.destroy();
            logger.info(`successfully connected to ${application.name}`);
            resolve({
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
                name: application.name,
                status: 'offline',
                type: 'tcp'
            });
        });
    });
}

async function getStatus(applications) {
    return Promise.all(applications.map(application =>
        getStatusOfApplication(application)));
}

module.exports = { getStatus };
