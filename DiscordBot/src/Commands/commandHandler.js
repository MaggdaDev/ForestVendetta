const {BaseInteraction} = require('discord.js');
class CommandHandler {

    /**
     * 
     * @param {Map} commands 
     */
    constructor(forestScout) {
        this.commands = forestScout.commands;
        this.forestScout = forestScout;
    }
    /**
     * 
     * @param {BaseInteraction} interaction 
     */
    handle(interaction) {
        if(!interaction.isChatInputCommand) return;
        if(this.commands.has(interaction.commandName)) {
            this.commands.get(interaction.commandName).handleCommand(interaction, this.forestScout);
        } else {
            throw "Registered but unknown command: " + interaction.commandName;
        }
    }
}

module.exports = CommandHandler;