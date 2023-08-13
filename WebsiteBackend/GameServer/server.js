const MainLoop = require('./mainLoop.js');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const NetworkCommands = require('../GameStatic/js/network/networkCommands.js');
const ServerNetworkManager = require('./network/serverNetworkManager');
const RabbitConnection = require('../../shared/rabbitConnection.js');
const ShardRabbitCommunicator = require('./rabbit/shardRabbitCommunicator.js');
const ShardRabbitCommandHandler = require('./rabbit/shardRabbitCommandHandler.js');
const AccessManager = require('./admin/accessManager.js');
const io = new Server(server);
const globalConfig = require("../../config-example/global-config.json");
var adressConfig;

const args = process.argv;
var host = args[2]; // first 2 elements internal
if(host === undefined) {
  console.error("Host undefined. Using default: minortom.net");
  host = "minortom.net";
}
var port = args[3];   
if(port === undefined) {
  console.error("Port undefined. Using default: 3000");
  port = 3000;
}
const uri = "http://" + host + ":" + port;  
var playerUri;
if(globalConfig.isTestMode) {
  playerUri = uri;
} else {
  const adressConfig = require("../../config-example/adresses-config.json");
  playerUri = adressConfig["game-adress"] + "/?port=" + port;
}
var gameID = args[4];
if(gameID === undefined) {
  console.error("GameID undefined. Using default: testtest123");
  gameID = "testtest123";
}
const createMessageID = args[5];
console.log("Hello world! Starting new shard with ID '" + gameID + "' and port: " + port);

console.log("Args: " + JSON.stringify(args));

//rabbit
console.log("Connecting shard to rabbit:");
const rabbitConnection = new RabbitConnection();
rabbitConnection.connectUntilSuccess(2000).then(()=> {
  console.log("Connected to rabbit successfully! Now continuing startup.");
  
  app.use(express.static('.'));
  //app.use(express.static("../../shared/."));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
  
  var playerMap = new Map();
  var mainLoop = new MainLoop(playerMap, server);
  var networkManager = new ServerNetworkManager(io, playerMap, mainLoop);
  var accessManager = new AccessManager(playerMap);
  const rabbitCommunicator = new ShardRabbitCommunicator(rabbitConnection, gameID, networkManager, uri, accessManager);
  rabbitCommunicator.sendCreateSuccess(createMessageID, playerUri);
  mainLoop.init(rabbitCommunicator);
  mainLoop.start();

  
  
  
  server.listen(port, () => {
    console.log('listening on port: ' + port);
  });
});
