const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const logger = require('../utils/logger');
const handleError = require('../utils/errorHandler');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
      logger.info('Started refreshing application (/) commands.');

      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      );

      logger.info('Successfully reloaded application (/) commands.');
    } catch (error) {
      handleError(error);
    }
  },
};
