# Application Status Monitoring Daemon

A NodeJS daemon to monitor application status using pm2, tcp and http and push statuses to a central [hub](https://github.com/dumindux/notification-hub) using web sockets
<br><br>
* When this application starts up it tries to establish a websocket connection to the specified server in the config ([notification hub](https://github.com/dumindux/notification-hub))
* If successful it starts checking the health of the services specified in the configuration periodically (These can be configured in the config)
* Health check updates are written to the websockets in real time.
* Notification hub (the server) collects this information and processes them.
