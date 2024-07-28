const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const parseDuration = require('../utils/timeParser');
const handleError = require('../utils/errorHandler');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Manage giveaways')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a new giveaway')
        .addIntegerOption(option =>
          option.setName('winners')
            .setDescription('Number of winners')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('duration')
            .setDescription('Duration of the giveaway (1d1h1m1s format)')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('prize')
            .setDescription('Prize for the giveaway')
            .setRequired(true))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'start') {
      try {
        const numberOfWinners = interaction.options.getInteger('winners');
        const duration = parseDuration(interaction.options.getString('duration'));
        const prize = interaction.options.getString('prize');

        const embed = new EmbedBuilder()
          .setTitle(config.giveaway.embed.title)
          .setDescription(config.giveaway.embed.description.replace('{prize}', prize).replace('{duration}', interaction.options.getString('duration')))
          .setTimestamp(Date.now() + duration)
          .setColor(config.giveaway.embed.color);

        const giveawayMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
        giveawayMessage.react('🎉');

        interaction.client.giveaways.set(giveawayMessage.id, {
          messageId: giveawayMessage.id,
          channelId: giveawayMessage.channel.id,
          prize: prize,
          endTime: Date.now() + duration,
          numberOfWinners: numberOfWinners
        });

        setTimeout(async () => {
          const giveawayData = interaction.client.giveaways.get(giveawayMessage.id);
          if (!giveawayData) return;

          const users = await giveawayMessage.reactions.cache.get('🎉').users.fetch();
          const participants = users.filter(user => !user.bot);

          if (participants.size > 0) {
            const winners = participants.random(giveawayData.numberOfWinners).map(user => user.toString()).join(', ');

            interaction.followUp(config.giveaway.messages.giveawayWinner.replace('{winners}', winners).replace('{prize}', giveawayData.prize));

            participants.forEach(async (user) => {
              try {
                await user.send(config.giveaway.messages.giveawayJoin);
              } catch (error) {
                logger.error(`Failed to send DM to ${user.tag}`);
                interaction.followUp({ content: config.giveaway.messages.giveawayJoinFailed, ephemeral: true });
              }
            });

          } else {
            interaction.followUp(config.giveaway.messages.giveawayNoParticipants);
          }

          interaction.client.giveaways.delete(giveawayMessage.id);
        }, duration);

      } catch (error) {
        handleError(error, interaction);
      }
    }
  },
};
