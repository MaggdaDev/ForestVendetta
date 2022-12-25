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
const io = new Server(server);

const args = process.argv;
const host = args[2]; // first 2 elements internal
const port = args[3];   
const uri = "http://" + host + ":" + port;  
const gameID = args[4];
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
  
  var playerList = new Map();
  var mainLoop = new MainLoop(playerList, server);
  var networkManager = new ServerNetworkManager(io, playerList, mainLoop);
  const rabbitCommunicator = new ShardRabbitCommunicator(rabbitConnection, gameID, networkManager, uri);
  rabbitCommunicator.sendCreateSuccess(createMessageID, uri);
  mainLoop.init();
  mainLoop.start();

  
  
  
  server.listen(port, () => {
    console.log('listening on port: ' + port);
  });
});
