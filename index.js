const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const logger = require('./utils/logger');
const handleError = require('./utils/errorHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
client.giveaways = new Map();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(config.token).then(() => {
  logger.info(`Logged in as ${client.user.tag}`);
}).catch(error => {
  handleError(error);
});
