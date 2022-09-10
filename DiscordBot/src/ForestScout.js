const CommandHandler = require("./Commands/commandHandler");
const CommandManager = require("./Commands/commandManager");
const {Message, Client} = require("discord.js");
const RabbitConnection = require("../../shared/rabbitConnection");

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
        this.commandManager = new CommandManager();
        this.commands = this.commandManager.loadCommands();
        this.commandHandler = new CommandHandler(this);

        // rabbit
        this.rabbitConnection = rabbitConnection;
        rabbitConnection.onMessageToDiscordBot((message)=>{
            console.log(message.content.toString());
        });
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