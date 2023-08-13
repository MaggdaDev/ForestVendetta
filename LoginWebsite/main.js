const globalConfig = require("../config-example/global-config.json");
const isTestMode = globalConfig.isTestMode;
if(globalConfig === undefined || globalConfig === null) throw "Invalid configuration";
const RabbitConnection = require("../shared/rabbitConnection");
const LoginServer = require("./loginServer");
const LoginMongoAccessor = require("./mongo/loginMongoAccessor");
console.log("Connecting to mongo...");
const mongoAccessor = new LoginMongoAccessor();
const rabbitConnection = new RabbitConnection();
mongoAccessor.connect().then(() => {
    console.log("Connected to mongo! Now connecting to rabbit...");
    rabbitConnection.connect().then(() => {
        console.log("Connected to rabbit!");
        console.log("Using testmode: " + isTestMode);

        const loginServer = new LoginServer(mongoAccessor, rabbitConnection, isTestMode);
        loginServer.createServer();
    });
});
