// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// path helps construct paths to access files and directories.
const path = require('node:path');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a new Collection to hold our commands
client.commands = new Collection();

// construct the path to the commands directory, basically join the current directory with the commands folder
const foldersPath = path.join(__dirname, 'commands');

// function readdirsync returns array of the folder name in the dir, which is utility
const commandFolders = fs.readdirSync(foldersPath);

// For each folder in the command folder
for (const folder of commandFolders) {
	// get the /utility path or whatever folder is in the commands folder
	const commandsPath = path.join(foldersPath, folder);
	// => is basically arrow function meaning the param is file, and the function says if it ends with js then return true
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// for each file (js files)
	for (const file of commandFiles) {
		// Same thing as before to get the path
		const filePath = path.join(commandsPath, file);
		// use require (basically import) to use the function that is exported
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
