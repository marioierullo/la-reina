const { Events, Collection } = require('discord.js');

/*
You will receive an interaction for every slash command executed. 
To respond to a command, you need to create a listener for the 
Client#event:interactionCreate event that will execute code 
when your application receives an interaction

Not every interaction is a slash command, only handle slash commands 
by making use of the BaseInteraction#isChatInputCommand() method 
to exit the handler if another type is encountered.
*/
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// only for command interactions
        if (interaction.isChatInputCommand()) {        
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            /*
            You check if the cooldowns Collection already has an entry 
            for the command being used. If this is not the case, you can add a new entry, 
            where the value is initialized as an empty Collection. 
            */
            const { cooldowns } = interaction.client;

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }
            
            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }
            
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
	},
};