const http = require('http');
const fs = require('fs');
const url = require("url");
const express = require('express');
const FVAPI = require('./api/fvapi');
const AdressManager = require('./adressManager');
const LoginRabbitCommunicator = require('./rabbit/loginRabbitCommunicator');
const ResourceServer = require('./resourceServer/resourceServer');

class LoginServer {
    static PORT = 2999;
    static LOCALHOST = "localhost";
    static HOST = "minortom.net";
    static LOGINPAGE = "index.html";
    constructor(mongoAccess, rabbitConnection, isTestMode) {
        this.server = null;
        if (isTestMode) {
            console.log("Entering TEST MODE");
            this.host = LoginServer.LOCALHOST;
        } /*else {
            this.host = LoginServer.HOST;
        }*/ // always localhost since caddy routes https to http at localhost
        this.port = LoginServer.PORT;
        this.adress = `http://${this.host}:${this.port}`;
        this.adressManager = new AdressManager(this.adress);

        console.log("Creating server for: " + this.host + ":" + this.port);
        this.rabbitCommunicator = new LoginRabbitCommunicator(rabbitConnection);
        this.api = new FVAPI(mongoAccess, this.rabbitCommunicator, this.adressManager);
        this.resourceServer = new ResourceServer();
        this.app = express();

        console.log("Setting up static serving of /client");
        this.app.use(express.static("./client"));

        console.log("Setting up routing of api requests to API");
        this.app.get(FVAPI.API_URI + "*", (req,res) => this.api.apiRequestListenerHandler(req,res));

        console.log("Setting up routing resource requests to resource server");     // for loading external resources, i.e. images from websitebackend
        this.app.get(ResourceServer.RESOURCE_SERVER_URI + "*", (req,res) => this.resourceServer.handleResourceRequest(req,res));

        this.mongoAccess = mongoAccess;

        
    }

    createServer() {
        console.log("Creating server...");
        this.server = http.createServer(this.app);
        this.server.listen(this.port, this.host, () => {
            console.log("Server is running on: " + this.adress);
        });
    }



    requestListener(req, res) {
        try {
            res.writeHeader(200, { "Content-Type": "text/html" });
            const reqUrl = req.url;
            const parsed = url.parse(reqUrl, true);
            const pathName = parsed.pathname;
            const query = parsed.query;

            const file = fs.readFileSync("client" + pathName);
            res.write(file);

            res.end();
            console.log("Sent successfully")
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = LoginServer;