const http = require('http');
const fs = require('fs');
const url = require("url");

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
    }

    createServer() {
        console.log("Creating server...");
        this.server = http.createServer((req, res) => this.requestListener(req, res));
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