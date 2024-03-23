const { Events, ChannelType } = require('discord.js');

// When the client is mentioned.
// It makes response choices.
module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        //check for different types messages or authors not utilized
        if (message.author.bot) return false;
        if (message.channel.type == ChannelType.DM) return false;
        if (message.channel.type == ChannelType.GroupDM) return false;
        
        // Check if the message mentions the bot
        if (message.mentions.has(message.client.user)) { 
            try {
                await message.channel.send('Hey there, you mentioned me!');
            } catch (error) {
                console.error(error);
                if (message.replied || message.deferred) {
                    await message.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
    },
};