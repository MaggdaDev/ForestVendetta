const CommandHandler = require("./Commands/commandHandler");
const CommandManager = require("./Commands/commandManager");
const {Message, Client} = require("discord.js");

class ForestScout {

    /**
     * 
     * @param {string} token 
     * @param {Client} client 
     */
    constructor(token, client) {
        console.log("Initializing ForestScout bot...");
        this.client = client;
        this.token = token;
        this.commandManager = new CommandManager();
        this.commands = this.commandManager.loadCommands();
        this.commandHandler = new CommandHandler(this);
    }

    onReady(instance) {
        console.log("Bot ready!");
        instance.commandManager.registerCommands(instance.token, instance.client.user.id);
    }

    onInteraction(instance, interaction) {
        console.log("interaction");
        instance.commandHandler.handle(interaction);
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