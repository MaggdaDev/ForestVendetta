
const config = require("../config-example/discordbot-config.json");
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
        console.log("Using discord bot config: " + JSON.stringify(config));

        const loginServer = new LoginServer(config, mongoAccessor, rabbitConnection);
        loginServer.createServer();
    });
});
