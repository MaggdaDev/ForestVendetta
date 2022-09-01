const { SlashCommandBuilder } = require('discord.js');

Ping = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Stinknormaler schinkenping'),

    async handleCommand(interaction) {
		await interaction.reply('Chilling!');
	}
}

module.exports = Ping;