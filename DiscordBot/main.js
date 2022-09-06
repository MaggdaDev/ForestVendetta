// Require the necessary discord.js classes
const { Routes, Client, GatewayIntentBits } = require('discord.js');
const secret = require('./_SECRET.json');
const {REST} = require('@discordjs/rest');
const config = require('../config-example/discordbot-config.json');
const CommandManager = require('./src/Commands/commandManager');
const ForestScout = require('./src/ForestScout');

// test mode?
var token;
if(config.ztestMode) {
    token = secret.test_token;
} else {
    token = secret.token;
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const forestScout = new ForestScout(token, client);

// When the client is ready, run this code (only once)
client.once('ready', ()=>forestScout.onReady(forestScout));
client.on('interactionCreate', (interaction)=>forestScout.onInteraction(forestScout, interaction));
client.on('messageCreate', (message)=>forestScout.onMessage(forestScout, message));
client.login(token);
