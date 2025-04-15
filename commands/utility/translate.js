const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');
const { geminiToken } = require('../../config.json'); // Store your API key securely
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

// Initialize the Gemini API client
const genAI = new GoogleGenAI({
    apiKey: geminiToken, // Replace with your actual API key
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Explain the given code snippet')
        .addStringOption(option =>
            option.setName('sentence')
                .setDescription('Sentence to be translated')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('langto')
                .setDescription('To what language')
                .setRequired(true)),
    
    async execute(interaction) {
        const sentence = interaction.options.getString('sentence');
        const lang = interaction.options.getString('langto');
        await interaction.deferReply(); // Let the bot think

        try {
            // Use the Gemini API to generate a response
            
            const response = await genAI.models.generateContent({
                model: 'gemini-2.0-flash', // Use the appropriate model
                contents: `Translate this : ${sentence}. Into the language ${lang}`,
            });

            const explanation = response.text || 'Could not fetch an explanation.';
            fs.writeFileSync('output.txt', explanation);
            await interaction.followUp({
                content: 'Here’s the explanation attached as a file:',
                files: ['output.txt']
            });
        } catch (error) {
            console.error(error);
            await interaction.followUp('Sorry, an error occurred while trying to explain the code.');
        }
    },
};