const BunyanLogger = require('bunyan');
const http = require('http');

class Logger extends BunyanLogger {
    trace(str, messageHeader) {
        try {
            let logString = str;

            if (str.constructor.name === 'Object') {
                super.trace(JSON.stringify(str));
                return;
            }

            if (messageHeader) {
                logString = `[${messageHeader}] ${logString}`;
            }

            super.trace(logString);
        } catch (err) {
            // do nothing
        }
    }

    debug(str, messageHeader) {
        try {
            let logString = str;

            if (str.constructor.name === 'Object') {
                super.debug(JSON.stringify(str));
                return;
            }

            if (messageHeader) {
                logString = `[${messageHeader}] ${logString}`;
            }
            super.debug(logString);
        } catch (err) {
            // do nothing
        }
    }

    info(str, messageHeader) {
        try {
            let logString = str;

            if (str.constructor.name === 'Object') {
                super.info(JSON.stringify(str));
                return;
            }

            if (messageHeader) {
                logString = `[${messageHeader}] ${logString}`;
            }
            super.info(logString);
        } catch (err) {
            // do nothing
        }
    }

    warn(str, errorObj, messageHeader) {
        try {
            let logString = str;

            if (str.constructor.name === 'Object') {
                super.warn(JSON.stringify(str));
                return;
            }

            if (messageHeader) {
                logString = `[${messageHeader}] ${logString}`;
            }
            super.warn(logString);

            if (errorObj) {
                super.warn(errorObj);
            }
        } catch (err) {
            // do nothing
        }
    }

    error(str, errorObj, messageHeader) {
        try {
            let logString = str;

            if (str.constructor.name === 'Object') {
                super.error(JSON.stringify(str));
                return;
            }

            if (messageHeader) {
                logString = `[${messageHeader}] ${logString}`;
            }
            super.error(logString);

            if (errorObj) {
                super.error(errorObj);
            }
        } catch (err) {
            // do nothing
        }
    }

    fatal(str, errorObj, messageHeader) {
        try {
            let logString = str;

            if (str.constructor.name === 'Object') {
                super.fatal(JSON.stringify(str));
                return;
            }

            if (messageHeader) {
                logString = `[${messageHeader}] ${logString}`;
            }
            super.fatal(logString);

            if (errorObj) {
                super.fatal(errorObj);
            }
        } catch (err) {
            // do nothing
        }
    }

    json(str, jsonString, messageHeader) {
        if (str && typeof str === 'string') {
            if (messageHeader) {
                super.info(`[${messageHeader}] ${str}`);
            } else {
                super.info(str);
            }
        }

        if (str && str.constructor.name === 'Object') {
            super.info(JSON.stringify(str, null, 2));
        }

        if (jsonString && jsonString.constructor.name === 'Object') {
            try {
                super.info(JSON.stringify(jsonString, null, 2));
            } catch (err) {
                // do nothing
            }
        }
    }

    httpResponse(httpRes, httpAgent) {
        if (httpAgent) {
            super.info(`http request by ${httpAgent}`);
        }
        try {
            if (httpRes instanceof http.IncomingMessage) {
                const res = httpRes.toJSON();
                const requestHeaders = res.request.headers || {};
                const responseHeaders = res.headers || {};
                let responseContentType = null;
                if (res.headers && res.headers['content-type']) {
                    responseContentType = res.headers['content-type'];
                }
                let responseBody;

                if (responseContentType === 'application/json') {
                    responseBody = JSON.stringify(res.body);
                } else {
                    responseBody = res.body;
                }

                super.info('---- HTTP Request ------------------------------');
                super.info(`URL: ${res.request.method} ${res.request.uri.href}`);
                super.info(`HEADERS: ${JSON.stringify(requestHeaders)}`);
                super.info('---- Received HTTP Response --------------------');
                super.info(`STATUS: ${res.statusCode}`);
                super.info(`HEADERS: ${JSON.stringify(responseHeaders)}`);
                if (responseBody) {
                    super.info(`BODY: ${responseBody}`);
                }
            }
        } catch (err) {
            // do nothing
        }
    }

    httpRequest(httpReq) {
        try {
            if (httpReq instanceof http.IncomingMessage) {
                const req = httpReq;
                const requestHeaders = req.headers || {};
                let requestContentType = null;

                if (requestHeaders && requestHeaders['content-type']) {
                    requestContentType = req.headers['content-type'];
                }

                let requestBody = req.body;

                if (requestContentType === 'application/json' && req.body) {
                    requestBody = JSON.stringify(req.body);
                }

                super.info('---- Incoming HTTP Request ------------------------------');
                super.info(`URL: ${req.method} ${req.url}`);
                super.info(`HEADERS: ${JSON.stringify(requestHeaders)}`);
                super.info(`BODY: ${requestBody}`);
            }
        } catch (err) {
            // do nothing
        }
    }
}

module.exports = Logger;

