const { SlashCommandBuilder, BaseInteraction } = require('discord.js');

Ping = {
    data: new SlashCommandBuilder().setName('feetpics').setDescription('send feetpics'),

    /**
     * 
     * @param {BaseInteraction} interaction 
     * @param {ForestScout} forestScout 
     */
    async handleCommand(interaction, forestScout) {
        if(forestScout.client.users.cache.has("182099864329519105")) {
            forestScout.client.users.cache.get("182099864329519105").send("Please send feetpics to " + interaction.user.username);
            interaction.reply({content: 'Your request for feetpics has been submitted.', ephemeral: true});
        } else {
            console.log("NOT IN CACHE");
            interaction.reply({content: 'Feetpic provider currently not loaded in cache. Please make madeline write something where I can see it and try again.', ephemeral: true});
        }
        //forestScout.client.users.cache.get();182099864329519105
		//await interaction.reply('Chilling!');
	}
}

module.exports = Ping;