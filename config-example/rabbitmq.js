const { execSync } = require("child_process");

const config = {
    "user":"",
    "pass":""
}

const ip = execSync("docker container inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' forestvendetta-rabbitmq");

export default {
    "v":"1",
    "connectstring":"amqp://" + config.user + ":" + config.pass + "@" + ip
};