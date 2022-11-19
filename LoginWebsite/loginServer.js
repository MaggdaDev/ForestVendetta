const http = require('http');
const fs = require('fs');
const url = require("url");
const express = require('express');
const FVAPI = require('./api/fvapi');

class LoginServer {
    static PORT = 2999;
    static LOCALHOST = "localhost";
    static HOST = "minortom.net";
    static LOGINPAGE = "index.html";
    constructor(config) {
        this.server = null;
        if (config.testMode) {
            console.log("Entering TEST MODE");
            this.host = LoginServer.LOCALHOST;
        } else {
            this.host = LoginServer.HOST;
        }
        this.port = LoginServer.PORT;
        console.log("Creating server for: " + this.host + ":" + this.port);
        this.api = new FVAPI();
        this.app = express();
        console.log("Setting up static serving of /client");
        this.app.use(express.static("./client"));
        console.log("Setting up routing of api requests to API");
        this.app.get(FVAPI.API_URI + "*", (req,res) => this.api.apiRequestListenerHandler(req,res));
    }

    createServer() {
        console.log("Creating server...");
        this.server = http.createServer(this.app);
        this.server.listen(this.port, this.host, () => {
            console.log(`Server is running on http://${this.host}:${this.port}`);
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