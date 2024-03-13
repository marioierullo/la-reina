// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//creating an express server
//const express = require('express');

// Create an express app
//const app = express();

//This line will read the .env file and set the environment variables in the process.env object.
require('dotenv').config();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

// Parse request body and verifies incoming requests using discord-interactions package
//app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));