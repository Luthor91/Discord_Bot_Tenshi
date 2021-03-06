const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('./config.json');
const fs = require('fs');

/* Pushing all the commands in your 'commands' folder into a array. */

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

/* Pass in the guild ID of the guild you want to push the commands to. */

const guildId = ["937034509055045672", "575419401814278144", "827170367432687648"];

var i = 0;

for(i=0;i<guildId.length;i++){
	
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}

	/* Registering the commands to the API. */

	const rest = new REST({ version: '9' }).setToken(token);

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId[i]),
				{ body: commands },
			);

			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	})();
	
}
