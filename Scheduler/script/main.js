const amqp = require('amqplib/callback_api');
const RabbitConnection = require('../../shared/rabbitConnection');
const Scheduler = require('./scheduler');

console.log("Preparing to start scheduler...");

//rabbit connection
console.log("Creating rabbit connection...");
const rabbitConnection = new RabbitConnection();
rabbitConnection.connectUntilSuccess(2000).then(()=>{
    console.log("Connected to rabbit => scheduler can be created.");
    console.log("Creating scheduler...");
    const scheduler = new Scheduler(rabbitConnection);
});