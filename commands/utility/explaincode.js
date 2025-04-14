const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');
const { openaiToken } = require('../../config.json');

// Initialize OpenAI instance
const openai = new OpenAI({
    apiKey: openaiToken, // Token from your config.json
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('explaincode')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Code that wants to be explained')
                .setRequired(true)),
    
    async execute(interaction) {
        const codeSnippet = interaction.options.getString('code');

        await interaction.deferReply(); // Let the bot think

        try {
            // Create the response with OpenAI API (v4 syntax)
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo', // Use a valid model
                messages: [
                    { role: 'system', content: 'You are a professional code explainer.' },
                    { role: 'user', content: `Explain this code: ${codeSnippet}` },
                ],
            });

            // Extract the response
            const explanation = response.choices[0].message.content.trim();
            await interaction.followUp(`Here’s the explanation: \n${explanation}`);
        } catch (error) {
            console.error(error);

            if (error instanceof OpenAI.APIError) {
                // Handle OpenAI-specific errors
                await interaction.followUp(`An API error occurred: ${error.message}`);
            } else {
                // Handle non-API errors
                await interaction.followUp('Sorry, an error occurred while trying to explain the code.');
            }
        }
    },
};