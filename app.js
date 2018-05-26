const logger = require('./utils/logger');

const monitors = {
    tcp: require('./monitors/tcp.monitor'),
    pm2: require('./monitors/pm2.monitor'),
    http: require('./monitors/http.monitor')
};

global.config = require('./config/system.config.json');
const applicationConfig = require('./config/application.config.json');

const WebSocketClient = require('websocket').client;

let connection = null;

const client = new WebSocketClient({ tlsOptions: { rejectUnauthorized: false } });

client.on('connectFailed', error =>
    logger.error(`connect error:  ${error.toString()}`));

client.on('connect', (newConnection) => {
    logger.info('websocket client connected');
    connection = newConnection;
    newConnection.on('error', (error) => {
        logger.error(`connection error:  ${error.toString()}`);
        connection = null;
    });
    newConnection.on('close', () => {
        logger.error('echo-protocol connection closed');
        connection = null;
    });
});

client.connect(`wss://${global.config.remote.host}:${global.config.remote.port}/`);

applicationConfig.forEach((application) => {
    setInterval(async () => {
        const status = await monitors[application.type].getStatusOfApplication(application);
        if (connection && connection.connected) {
            status.time = Date.now();
            connection.sendUTF(JSON.stringify(status));
        } else {
            client.connect(`wss://${global.config.remote.host}:${global.config.remote.port}/`);
        }
    }, application.interval);
});

// {
//     "name": "React Course Manager",
//     "type": "tcp",
//     "host": "localhost",
//     "port": 4440,
//     "interval": 2000
//   },
//   {
//     "name": "SFTP File Processor",
//     "type": "pm2",
//     "host": "localhost",
//     "processName": "file-processor",
//     "interval": 2000
//   },
