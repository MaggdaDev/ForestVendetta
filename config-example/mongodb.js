const { execSync } = require("child_process");

const config = {
    "user":"user",
    "pass":"pass2",
    "database":"forestvendetta"
}

const ip = '127.69.42.34:27017';//execSync("docker container inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' forestvendetta-rabbitmq");

module.exports = {
    "v":"1",
    "connectstring":"mongodb://" + config.user + ":" + config.pass + "@" + ip + "/" + config.database + "?serverSelectionTimeoutMS=1000",
    "config":config    
};