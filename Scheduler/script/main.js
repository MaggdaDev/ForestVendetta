const amqp = require('amqplib/callback_api');

console.log("Beginning to start schedular...");

// requiring connect string
const CONFIG_LOCATION = '../../config-example';
const CONFIG_NAME = 'rabbitmq';
const connectConfig = require(CONFIG_LOCATION + "/" + CONFIG_NAME);
console.log("Connect config from '" + CONFIG_LOCATION + "/" + CONFIG_NAME + "' required: " + JSON.stringify(connectConfig));

// connect
console.log("Trying to connect using '" + connectConfig.connectstring + "': ");
amqp.connect(connectConfig.connectstring, (error0, connection)=>{
    if(error0) throw error0;
    console.log("Successfully connected to " + connection);
    connection.createChannel((error1, channel)=>{
        if(error1) throw error1;
        console.log("Channel created: " + channel);
    });
});