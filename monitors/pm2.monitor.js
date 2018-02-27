const pm2 = require('pm2');
const logger = require('../utils/logger');

function pm2Connect() {
    return new Promise((resolve) => {
        pm2.connect((err) => {
            resolve(err);
        });
    });
}

function getStatusOfApplication(application) {
    return new Promise((resolve) => {
        pm2.describe(application.processName, (err, processDescription) => {
            if (err || processDescription.length === 0) {
                logger.error(`error while connecting to ${application.name}`);
                logger.error(err);
                resolve({
                    name: application.name,
                    status: 'offline',
                    type: 'pm2'
                });
                return;
            }

            logger.info(`successfully connected to ${application.name}`);

            resolve({
                name: application.name,
                status: processDescription[0].pm2_env.status === 'online' ? 'online' : 'offline',
                type: 'pm2',
                pmUptime: processDescription[0].pm2_env.pm_uptime + '',
                createdAt: processDescription[0].pm2_env.created_at + '',
                pmId: processDescription[0].pm2_env.pm_id + '',
                restartTime: processDescription[0].pm2_env.restart_time + '',
                unstableRestarts: processDescription[0].pm2_env.unstable_restarts + '',
                nodeVersion: processDescription[0].pm2_env.node_version + ''
            });
        });
    });
}

async function getStatus(applications) {
    const err = await pm2Connect();
    if (err) {
        return [];
    }

    const results = await Promise.all(applications.map(application =>
        getStatusOfApplication(application)));

    pm2.disconnect();

    return results;
}

module.exports = { getStatus };
