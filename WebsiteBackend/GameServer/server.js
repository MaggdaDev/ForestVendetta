const MainLoop = require('./mainLoop.js');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const NetworkCommands = require('../GameStatic/js/network/networkCommands.js');
const ServerNetworkManager = require('./network/serverNetworkManager');
const io = new Server(server);

const args = process.argv;
const port = args[2];     // first 2 elements internal

console.log("Args: " + JSON.stringify(args));

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

var playerList = new Map();
var mainLoop = new MainLoop(playerList);
var networkManager = new ServerNetworkManager(io, playerList, mainLoop);
mainLoop.init();
mainLoop.start();


server.listen(port, () => {
  console.log('listening on port: ' + port);
});