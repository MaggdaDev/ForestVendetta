const CommandHandler = require("./Commands/commandHandler");
const CommandManager = require("./Commands/commandManager");
const { Message, Client, DiscordAPIError } = require("discord.js");
const RabbitConnection = require("../../shared/rabbitConnection");
const RabbitCommandHandler = require("./Rabbit/discordRabbitCommandHandler");
const RabbitCommunicator = require("./Rabbit/discordRabbitCommunicator");
const DiscordMessageSender = require("./discordMessageSender");
const ForestScoutMongoAccessor = require("./MongoAccess/ForestScoutMongoAccessor");

class ForestScout {

    /**
     * 
     * @param {string} token 
     * @param {Client} client 
     * @param {RabbitConnection} rabbitConnection
     */
    constructor(token, client, rabbitConnection, mongoAccessor, testMode) {
        console.log("Initializing ForestScout bot...");
        this.client = client;
        this.token = token;
        this.testMode = testMode;

        // discord slash commands
        this.commandManager = new CommandManager();
        this.commands = this.commandManager.loadCommands();
        this.commandHandler = new CommandHandler(this);

        // discord message sender
        this.discordMessageSender = new DiscordMessageSender(this.client, this.testMode);

        // rabbit
        this.rabbitConnection = rabbitConnection;
        this.rabbitCommandHandler = new RabbitCommandHandler(this);
        this.rabbitCommunicator = new RabbitCommunicator(this.rabbitConnection, this.rabbitCommandHandler);

        // mongo
        this.mongoAccess = new ForestScoutMongoAccessor(this, mongoAccessor);
        
        var instance = this;

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