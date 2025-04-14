const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');
const { geminiToken } = require('../../config.json'); // Store your API key securely
const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini API client
const genAI = new GoogleGenAI({
    apiKey: geminiToken, // Replace with your actual API key
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('explaingemini')
        .setDescription('Explain the given code snippet')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Code that wants to be explained')
                .setRequired(true)),
    
    async execute(interaction) {
        const codeSnippet = interaction.options.getString('code');
        await interaction.deferReply(); // Let the bot think

        try {
            // Use the Gemini API to generate a response
            
            const response = await genAI.models.generateContent({
                model: 'gemini-2.0-flash', // Use the appropriate model
                contents: `Explain this code in less than 100 words: ${codeSnippet}`,
            });

            const explanation = response.text || 'Could not fetch an explanation.';
            await interaction.followUp(`Here’s the explanation: \n${explanation}`);
        } catch (error) {
            console.error(error);
            await interaction.followUp('Sorry, an error occurred while trying to explain the code.');
        }
    },
};