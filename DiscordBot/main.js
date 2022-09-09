// Require the necessary discord.js classes
const { Routes, Client, GatewayIntentBits } = require('discord.js');
const secret = require('./_SECRET.json');
const { REST } = require('@discordjs/rest');
const config = require('../config-example/discordbot-config.json');
const CommandManager = require('./src/Commands/commandManager');
const ForestScout = require('./src/ForestScout');
const RabbitConnection = require('../shared/rabbitConnection');

async function init() {
    logMain("Preparing to start discord bot...");
    // test mode?
    var token;
    if (config.testMode) {
        token = secret.test_token;
        logMain("TESTMODE ACTIVE");
        logMain("testmode => test token for test-bot user is used");
    } else {
        token = secret.token;
        logMain("NORMAL MODE ACTIVE");
        logMain("normal mode => official forest scout bot account used");
    }

    // wait for rabbit connection
    const rabbitConnection = new RabbitConnection();
    if (config.testMode) {
        await rabbitConnection.connectUntilSuccess(2000);
    } else {
        rabbitConnection.connect();
    }

    // Create a new client instance
    logMain("Creating bot discord client...");
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    logMain("Creating Bot...");
    const forestScout = new ForestScout(token, client);

    // When the client is ready, run this code (only once)
    client.once('ready', () => forestScout.onReady(forestScout));
    client.on('interactionCreate', (interaction) => forestScout.onInteraction(forestScout, interaction));
    client.on('messageCreate', (message) => forestScout.onMessage(forestScout, message));

    // finished
    logMain("[main] All preparations finished - block main thread to run bot");
    await client.login(token);
}
init();

function logMain(s) {
    console.log("[main] " + s);
}
