const { execSync } = require("child_process");

const config = {
    "user":"user",
    "pass":"pass2",
    "database":"forestvendetta"
}

const ip = execSync("docker container inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' forestvendetta-rabbitmq");

export default {
    "v":"1",
    "connectstring":"mongodb://" + config.user + ":" + config.pass + "@" + ip + "/" + config.database,
    "config":config    
};