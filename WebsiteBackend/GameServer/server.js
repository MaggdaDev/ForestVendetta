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
const io = new Server(server, {
  path: "/g/socket.io"
});
const globalConfig = require("../../config-example/global-config.json");
var adressConfig;

const args = process.argv;
var host = args[2]; // first 2 elements internal
var port = args[3];   
if(port === undefined) {
  console.error("Port undefined. Using default: 3000");
  port = 3000;
}
var accessUri;
if(globalConfig.isTestMode) {
  accessUri = "http://" + host + ":" + port; 
} else {
  const adressConfig = require("../../config-example/adresses-config.json");
  accessUri = adressConfig["game-adress"] + "/?port=" + port;
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
  const rabbitCommunicator = new ShardRabbitCommunicator(rabbitConnection, gameID, networkManager, accessUri, accessManager, port);
  rabbitCommunicator.sendCreateSuccess(createMessageID, accessUri);
  mainLoop.init(rabbitCommunicator);
  mainLoop.start();

  
  
  
  server.listen(port, () => {
    console.log('listening on port: ' + port);
  });
});
