//This line will read the .env file and set the environment variables in the process.env object.
require('dotenv').config();

//The fs module is Node's native file system module. 
//fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');

//The path module is Node's native path utility module. 
//path helps construct paths to access files and directories. 
const path = require('node:path');

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality. 
//Collection is used to store and efficiently retrieve commands for execution.
//Attaching a .commands property to your client instance allows the access to your commands in other files.
client.commands = new Collection();

//dynamically retrieve your command files
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//dynamically retrieve your event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

//creating an express server
//const express = require('express');

// Create an express app
//const app = express();

// Parse request body and verifies incoming requests using discord-interactions package
//app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
