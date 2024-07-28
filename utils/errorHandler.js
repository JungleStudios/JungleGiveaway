const logger = require('./logger');

const handleError = (error, interaction) => {
  logger.error(error.message);
  if (interaction) {
    interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
  }
};

module.exports = handleError;
