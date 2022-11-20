class Connector {

    /**
     * 
     * @param {function} connectMethod - should return promise
     */
    constructor(connectMethod) {
        this.connectMethod = connectMethod;
    }

    connect() {
        var instance = this;
        const prom = new Promise((resolve, reject) => {
            logConnector("Trying to connect");
            instance.connectMethod().then(() => {
                logConnector("Successfully connected!");
                resolve();                       
            }).catch((error) => {
                reject(error);
            });
        });
        return prom;
    }

    /**
     * 
     * @param {number} interval - time in ms between connection attempts, default 1000
     * @returns 
     */
    connectUntilSuccess(interval) {
        logConnector("Starting connect until success...");
        if (interval === undefined || interval === null) {
            logConnector("Retry interval was not defined; using 1000ms as default");
            interval = 1000;
        }
        const instance = this;
        logConnector("Doing first attempt to connect...");
        const prom = new Promise((resolve, reject) => {
            this.connect()
                .then((connection) => {
                    logConnector("First attempt to connect was successful!");
                    resolve();
                })
                .catch((error) => {
                    logConnector("First attempt to connect failed. Starting blocking recursive connection attempts with interval " + interval + "...");
                    instance._connectUntilSuccessRecursion(interval).then((connection) => {
                        resolve();
                    });
                });
        }, 2000);
        return prom;
    }

    _connectUntilSuccessRecursion(interval) {
        const instance = this;
        const prom = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.connect()
                    .then((connection) => {
                        resolve(connection);
                    })
                    .catch((error) => {
                        logConnector("Can't connect! Retrying in " + interval + "ms...");
                        instance._connectUntilSuccessRecursion(interval).then((connection) => {
                            resolve(connection);
                        });
                    });
            }, interval);

        });
        return prom;
    }
}

function logConnector(s) {
    console.log("[connector] " + s);
}

module.exports = Connector;