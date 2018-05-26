const pm2 = require('pm2');
const logger = require('../utils/logger');

function pm2Connect() {
    return new Promise((resolve) => {
        pm2.connect((err) => {
            resolve(err);
        });
    });
}

async function getStatusOfApplication(application) {
    const err = await pm2Connect();
    if (err) {
        return [];
    }

    const status = await new Promise((resolve) => {
        pm2.describe(application.processName, (err, processDescription) => {
            if (err || processDescription.length === 0) {
                logger.error(`error while connecting to ${application.name}`);
                logger.error(err);
                resolve({
                    monitoringServer: global.config.application.serverName,
                    name: application.name,
                    status: 'offline',
                    type: 'pm2'
                });
                return;
            }

            logger.info(`successfully connected to ${application.name}`);

            resolve({
                monitoringServer: global.config.application.serverName,
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

    pm2.disconnect();

    return status;
}

module.exports = { getStatusOfApplication };
