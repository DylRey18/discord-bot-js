const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path'); // Added for dynamic path handling

module.exports = {
    data: new SlashCommandBuilder()
        .setName('animefy')
        .setDescription('Generate anime image from your given image')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Image for the image generation')
                .setRequired(true)),
    
    async execute(interaction) {
        const attachment = interaction.options.getAttachment('image'); // Get the uploaded image
        await interaction.deferReply(); // Let the bot think

        try {
            // Validate the uploaded file type
            if (!attachment.contentType.startsWith('image')) {
                await interaction.followUp('Please upload a valid image file.');
                return;
            }

            // Send request to Stable Diffusion's API with specified parameters
            const response = await axios.post('http://127.0.0.1:7860/sdapi/v1/img2img', {
                prompt: "1other, solo, masterpiece, best quality, (anime-style), highly detailed, dynamic pose, expressive facial features, gender-neutral aesthetic, elegant background, vibrant colors, cinematic lighting",
                negative_prompt: " negativeXL_D",
                steps: 30,
                cfg_scale: 13,
                sampler_name: "DPM++ 2M SDE",
                scheduler: "Karras",
                seed: -1,
                width: 1024,
                height: 1024,
                denoising_strength: 0.35,
                
            });

            // Decode the Base64 image
            const base64Image = response.data.images[0];
            const buffer = Buffer.from(base64Image, 'base64');

            // Define the output file path dynamically
            const outputDir = path.resolve(__dirname, '../../data'); // Adjust as needed
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true }); // Ensure the directory exists
            }
            const filePath = path.join(outputDir, 'output2.png');

            // Save the image to the file
            fs.writeFileSync(filePath, buffer);

            // Send the image back to the Discord user
            await interaction.followUp({
                content: 'Here’s your generated image:',
                files: [filePath]
            });

            // Clean up the file after sending
            fs.unlinkSync(filePath);

        } catch (error) {
            console.error('Error during image generation:', error.message);
            await interaction.followUp('Something went wrong while generating the image.');
        }
    }
};