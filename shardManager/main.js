const RabbitConnection = require("../shared/rabbitConnection");
const ShardManager = require("./shardManager");
var ADRESS = "http://minortom.net";
const argv = process.argv;
var localhostMode = false;
if(argv.length > 2 && argv[2] === "localhost") {
    localhostMode = true;
    console.log("Enabling LOCALHOST_MODE!");
    ADRESS = "http://localhost";
} else {
    console.log("Disabled LOCALHOSt_MODE, using " + ADRESS);
}
const rabbitConnection = new RabbitConnection();
rabbitConnection.connectUntilSuccess(2000).then(()=>{
    console.log("Rabbit connection established! Now starting...");
    const shardManager = new ShardManager(rabbitConnection, ADRESS);
    setInterval(()=> {
        console.log("I'M STILL STANDING" + shardManager);
    }, 2000);
});

