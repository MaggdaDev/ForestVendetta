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

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

var playerList = new Map();
var mainLoop = new MainLoop(playerList);
var networkManager = new ServerNetworkManager(io, playerList, mainLoop);

mainLoop.start();


server.listen(3000, () => {
  console.log('listening on *:3000');
});