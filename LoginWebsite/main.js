
const config = require("../config-example/discordbot-config.json");
const LoginServer = require("./loginServer");
console.log("Using discord bot config: " + JSON.stringify(config));

const loginServer = new LoginServer(config);
loginServer.createServer();