const https = require('https');
const fs = require('fs');
const logger = require('./utils/logger');

const monitors = {
    tcp: require('./monitors/tcp.monitor'),
    pm2: require('./monitors/pm2.monitor'),
    http: require('./monitors/http.monitor')
};

global.config = require('./config/system.config.json');
const applicationConfig = require('./config/application.config.json');

const httpsOptions = {
    key: fs.readFileSync(global.config.tls.key),
    cert: fs.readFileSync(global.config.tls.cert)
};

const server = https.createServer(httpsOptions);

const WebSocketServer = require('websocket').server;

const connections = [];

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', (request) => {
    const connection = request.accept();
    console.log(request);
    logger.info(`a client is connected from ${request.remoteAddress}`);

    connections.push(connection);

    connection.on('close', () => {
        const index = connections.indexOf(connection);
        if (index !== -1) {
            connections.splice(index, 1);
        }
        logger.info('client disconnected');
    });
});

server.listen(global.config.application.port, () => {
    logger.info(`server is listening on port ${global.config.application.port}`);
});

applicationConfig.forEach((application) => {
    setInterval(
        () =>
            monitors[application.type].getStatusOfApplication(application)
                .then(status =>
                    connections.forEach(connection =>
                        connection.sendUTF(JSON.stringify(status))))
        , application.interval
    );
});
