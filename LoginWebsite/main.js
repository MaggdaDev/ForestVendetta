
const config = require("../config-example/discordbot-config.json");
const LoginServer = require("./loginServer");
const LoginMongoAccessor = require("./mongo/loginMongoAccessor");
console.log("Connecting to mongo...");
const mongoAccessor = new LoginMongoAccessor();
mongoAccessor.connect().then(()=> {
    console.log("Using discord bot config: " + JSON.stringify(config));

    const loginServer = new LoginServer(config, mongoAccessor);
    loginServer.createServer();
})
