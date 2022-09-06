const amqp = require('amqplib/callback_api');

amqp.connect('amqp://192.168.137.1', (error0, connection)=>{
    if(error0) throw error0;
    connection.createChannel(error1, channel)=>{
        if(error1) throw
    });
});
