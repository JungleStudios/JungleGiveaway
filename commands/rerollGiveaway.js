const { SlashCommandBuilder } = require('discord.js');
const handleError = require('../utils/errorHandler');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rerollgiveaway')
    .setDescription('Reroll the winner of an ended giveaway')
    .addStringOption(option =>
      option.setName('messageid')
        .setDescription('Message ID of the giveaway to reroll')
        .setRequired(true)),
  async execute(interaction) {
    try {
      const messageId = interaction.options.getString('messageid');
      const giveawayData = interaction.client.giveaways.get(messageId);

      if (!giveawayData) {
        return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
      }

      const giveawayMessage = await interaction.channel.messages.fetch(giveawayData.messageId);
      const users = await giveawayMessage.reactions.cache.get('🎉').users.fetch();
      const participants = users.filter(user => !user.bot);

      if (participants.size > 0) {
        const winners = participants.random(giveawayData.numberOfWinners).map(user => user.toString()).join(', ');

        interaction.reply(config.giveaway.messages.giveawayWinner.replace('{winners}', winners).replace('{prize}', giveawayData.prize));

        participants.forEach(async (user) => {
          try {
            await user.send(config.giveaway.messages.giveawayJoin);
          } catch (error) {
            logger.error(`Failed to send DM to ${user.tag}`);
            interaction.followUp({ content: config.giveaway.messages.giveawayJoinFailed, ephemeral: true });
          }
        });
      } else {
        interaction.reply(config.giveaway.messages.giveawayNoParticipants);
      }
    } catch (error) {
      handleError(error, interaction);
    }
  },
};
