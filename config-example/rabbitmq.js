const { execSync } = require("child_process");

const config = {
    "user":"user",
    "pass":"pass",
    "database":"forestvendetta"
}

const ip = "127.69.42.34";//execSync("docker container inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' forestvendetta-rabbitmq");

module.exports = {
    "v":"1",
    "connectstring":"amqp://" + config.user + ":" + config.pass + "@" + String(ip).replace("\n", ""),   // docker container inspect returns ip + \n idk why
    "config":config,
    "miniconnectstring": "amqp://" + ip
};