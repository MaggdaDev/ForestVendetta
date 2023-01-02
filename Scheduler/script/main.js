const amqp = require('amqplib/callback_api');
const MongoAccessor = require('../../shared/mongoAccess/mongoAccessor');
const RabbitConnection = require('../../shared/rabbitConnection');
const Scheduler = require('./scheduler');

console.log("Preparing to start scheduler...");

//rabbit connection
console.log("Creating rabbit connection...");
const rabbitConnection = new RabbitConnection();
const mongoAccessor = new MongoAccessor();
rabbitConnection.connectUntilSuccess(2000).then(()=>{
    console.log("Connected to rabbit => connectinig to mongo now");
    mongoAccessor.connectUntilSuccess().then(()=> {
        console.log("Connected to mongo => create scheduler");
        console.log("Creating scheduler...");
        const scheduler = new Scheduler(rabbitConnection, mongoAccessor);
        scheduler.startMainLoop();
    })
    
});