const RabbitConnection = require("../shared/rabbitConnection");
const ShardManager = require("./shardManager");

console.log("Starting shard manager...");
const rabbitConnection = new RabbitConnection();
rabbitConnection.connectUntilSuccess(2000).then(()=>{
    console.log("Rabbit connection established! Now starting...");
    const shardManager = new ShardManager(rabbitConnection);
    setInterval(()=> {
        console.log("I'M STILL STANDING" + shardManager);
    }, 2000);
});

