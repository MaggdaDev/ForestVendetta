const RabbitConnection = require("../shared/rabbitConnection");
const RabbitComandHandler = require("./rabbitCommunication/rabbitCommandHandler");
const {fork} = require("child_process");
const stream = require("stream");

class ShardManager {

    /**
     * 
     * @param {RabbitConnection} rabbitConnection 
     */
    static startPort = 3000;
    static GAMEBACKEND_CWD_PATH = "../WebsiteBackend";
    static GAMEOACKEND_CWD_TO_SERVER = "/GameServer/server";
    constructor(rabbitConnection) {
        this.rabbitConnection = rabbitConnection;
        this.rabbitCommandHandler = new RabbitComandHandler(this);
        this.rabbitConnection.onMessageToShardHandler((message) => this.rabbitCommandHandler.handle(message));
        this.usedPorts = [];
        this.shards = [];
        this.createShard();
    }

    /**
     * 
     * @param {number} port 
     */
    createShard(message) {
        console.log("Creating shard...");
        const shardPort = this.reserveFreePort();
        console.log("Port for new shad: " + shardPort);
        console.log("Now all used ports are: " + this.usedPorts);

        // forking child
        const child = fork(ShardManager.GAMEBACKEND_CWD_PATH + ShardManager.GAMEOACKEND_CWD_TO_SERVER, [shardPort], {
            cwd: ShardManager.GAMEBACKEND_CWD_PATH, // working directory for server
            silent: true
            
        });
        child.stdout.on("data", (message)=> {
            console.log("[Port " + shardPort + "] " + message);
        });

        this.shards.push(child);

        console.log("Created and added new child!");

    }

    reserveFreePort() { // get next free port >= 3000
        if(this.usedPorts.length === 0) {
            this.usedPorts.push(ShardManager.startPort);
            return ShardManager.startPort;
        }
        for(var i = 0; i < this.usedPorts.length; i += 1) {
            if(i === this.usedPorts.length-1 || this.usedPorts[i+1] - this.usedPorts[i] >= 2) {
                const newPort = this.usedPorts[i] + 1;
                this.usedPorts.push(newPort);
                this.usedPorts.sort((a,b) =>a-b);
                return newPort;
            }
        }
        
    }
}

module.exports = ShardManager;