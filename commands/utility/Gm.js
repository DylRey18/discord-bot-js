//  This line is equivalent to, {} is for destructuring
//  const discord = require('discord.js')
//  const SlashCommandBuilder = discord.SlashCommandBuilder
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('GM').setDescription('Replies with Good Morning!'),
	async execute(interaction) {
		await interaction.reply('Good Morning!');
	},
};