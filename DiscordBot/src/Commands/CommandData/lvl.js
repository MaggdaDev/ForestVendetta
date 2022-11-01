const { SlashCommandBuilder } = require('discord.js');
const ForestScout = require('../../forestScout');

Lvl = {
    data: new SlashCommandBuilder().setName('lvl').setDescription('Get your account level'),

    /**
     * 
     * @param {*} interaction 
     * @param {ForestScout} forestScout 
     */
    async handleCommand(interaction, forestScout) {
		await interaction.reply("Your account level is: " + await forestScout.mongoAccess.getAccountLevel(interaction.user.id));
	}
}

module.exports = Lvl;