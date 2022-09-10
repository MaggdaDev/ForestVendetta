const CommandHandler = require("./Commands/commandHandler");
const CommandManager = require("./Commands/commandManager");
const { Message, Client } = require("discord.js");
const RabbitConnection = require("../../shared/rabbitConnection");
const RabbitCommandHandler = require("./Rabbit/discordRabbitCommandHandler");
const RabbitCommunicator = require("./Rabbit/discordRabbitCommunicator");

class ForestScout {

    /**
     * 
     * @param {string} token 
     * @param {Client} client 
     * @param {RabbitConnection} rabbitConnection
     */
    constructor(token, client, rabbitConnection) {
        console.log("Initializing ForestScout bot...");
        this.client = client;
        this.token = token;

        // discord slash commands
        this.commandManager = new CommandManager();
        this.commands = this.commandManager.loadCommands();
        this.commandHandler = new CommandHandler(this);

        // rabbit
        this.rabbitConnection = rabbitConnection;
        this.rabbitCommandHandler = new RabbitCommandHandler(this);
        this.rabbitCommunicator = new RabbitCommunicator(this.rabbitConnection, this.rabbitCommandHandler);
        
        var instance = this;

    }

    sendTestMessage() {
        if (this.client.channels.cache.has('847198558204985354')) {
                this.client.channels.cache.get('847198558204985354').send("ss");
        } else {
            console.log("Cache not loaded");
        }
    }

    onReady(instance) {
        console.log("Bot ready!");
        instance.commandManager.registerCommands(instance.token, instance.client.user.id);
    }

    onInteraction(instance, interaction) {
        console.log("interaction");
        instance.commandHandler.handle(interaction);
        this.rabbitConnection.sendToScheduler(interaction.commandName);
    }

    /**
     * 
     * @param {ForestScout} instance 
     * @param {Message} message 
     */
    onMessage(instance, message) {
        console.log("Message: " + message.content);
        instance.client.users.cache.set(message.author.id, message.author);

    }
}

module.exports = ForestScout;