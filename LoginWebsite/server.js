const http = require('http');
const url = require('url');
const fs = require('fs');
const config = require("../config-example/discordbot-config.json");
console.log("Using discord bot config: " + JSON.stringify(config));

var host;
if (config.testMode) {
    console.log("Entering TEST MODE");
    host = "localhost";
    //document.getElementById("loginWithDiscordForm").action = "https://discord.com/api/oauth2/authorize?client_id=1014855311259078666&redirect_uri=http%3A%2F%2Flocalhost%3A2999%2Fredirect.html&response_type=code&scope=identify";
} else {
    host = "minortom.net";
}
const port = "2999";


const requestListener = function (req, res) {
    try {
        res.writeHeader(200, { "Content-Type": "text/html" });

        if (req.url === "isTestMode") {
            res.write("true");
        } else {

            const file = fs.readFileSync("client" + req.url);
            res.write(file);
        }
        res.end();
        console.log("Sent successfully")
    } catch (e) {
        console.log(e);
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});