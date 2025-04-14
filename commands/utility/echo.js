const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption(option =>
            option.setName('input')
            .setDescription('The input to echo back')
            .setRequired(true)),
    async execute(interaction) {
        // Get the user's input from the interaction
        const userInput = interaction.options.getString('input');
        // Reply with the user's input
        await interaction.reply(`You said: ${userInput}`);
    },
};