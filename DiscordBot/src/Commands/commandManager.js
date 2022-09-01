const { REST } = require('@discordjs/rest');
const { Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
class CommandManager {
    static COMMANDS_PATH = '/CommandData';

    constructor() {
        this.commands = new Map();
    }



    loadCommands() {
        const commandFiles = fs.readdirSync(__dirname + CommandManager.COMMANDS_PATH);
        var currAdd;
        commandFiles.forEach(currCommandFile => {
            currAdd = require('.' + CommandManager.COMMANDS_PATH + '/' + currCommandFile);
            this.commands.set(currAdd.data.name, currAdd);
        });     
        return this.commands;
    }

    async registerCommands(token, clientID) {
        
        const rest = new REST().setToken(token);
        const commandDataList = [];
        this.commands.forEach((currCommand)=>{
            commandDataList.push(currCommand.data.toJSON());
        })
        console.log("Registering " + commandDataList.length + " commands...");
        await rest.put(
            Routes.applicationCommands(clientID),
            { body: commandDataList },
        );
        console.log("Command registration finished.");
    }
}
module.exports = CommandManager;