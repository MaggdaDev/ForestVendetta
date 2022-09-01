// Require the necessary discord.js classes
const { Routes, Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./_SECRET.json');
const {REST} = require('@discordjs/rest');
const CommandManager = require('./src/Commands/commandManager');
const ForestScout = require('./src/ForestScout');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const forestScout = new ForestScout(token, client);

// When the client is ready, run this code (only once)
client.once('ready', ()=>forestScout.onReady(forestScout));
client.on('interactionCreate', (interaction)=>forestScout.onInteraction(forestScout, interaction));
client.on('messageCreate', (message)=>forestScout.onMessage(forestScout, message));
client.login(token);
