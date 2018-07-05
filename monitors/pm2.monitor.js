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
    const error = await pm2Connect();
    if (error) {
        return [];
    }

    const status = await new Promise((resolve) => {
        pm2.describe(application.processName, (err, processDescription) => {
            if (err || processDescription.length === 0) {
                logger.error(`error while connecting to ${application.name}`);
                logger.error(err);
                resolve({
                    tags: {
                        monitoringServer: global.config.application.serverName,
                        name: application.name,
                        type: 'pm2'
                    },
                    fields: {
                        status: 'offline',
                        statusValue: 0
                    }
                });
                return;
            }

            logger.info(`successfully connected to ${application.name}`);

            resolve({
                tags: {
                    monitoringServer: global.config.application.serverName,
                    name: application.name,
                    type: 'pm2'
                },
                fields: {
                    status: processDescription[0].pm2_env.status === 'online' ? 'online' : 'offline',
                    statusValue: 1,
                    pmUptime: processDescription[0].pm2_env.pm_uptime,
                    createdAt: processDescription[0].pm2_env.created_at,
                    pmId: processDescription[0].pm2_env.pm_id,
                    restartTime: processDescription[0].pm2_env.restart_time,
                    unstableRestarts: processDescription[0].pm2_env.unstable_restarts,
                    nodeVersion: processDescription[0].pm2_env.node_version
                }
            });
        });
    });

    pm2.disconnect();

    return status;
}

module.exports = { getStatusOfApplication };
