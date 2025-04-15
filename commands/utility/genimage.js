const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path'); // Added for dynamic path handling

module.exports = {
    data: new SlashCommandBuilder()
        .setName('genimage')
        .setDescription('Generate AI image')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Prompt for the image generation')
                .setRequired(true)),
    
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        await interaction.deferReply(); // Let the bot think

        try {
            // Send request to Stable Diffusion's API with specified parameters
            const response = await axios.post('http://127.0.0.1:7860/sdapi/v1/txt2img', {
                prompt: `(masterpiece), ${prompt}`,
                negative_prompt: "lowres, text, error, cropped, worst quality, low quality, out of frame, extra fingers, mutated hands, poorly drawn hands, deformed, blurry, bad anatomy, watermark",
                steps: 25,
                cfg_scale: 10,
                sampler_name: "DPM++ 2M",
                scheduler: "Karras",
                seed: -1,
                width: 512,
                height: 512,
                denoising_strength: 0.5,
                enable_hr: false,
                hr_scale: 2,
                hr_upscaler: "ESRGAN_4x",
                hr_steps: 15
            });

            // Decode the Base64 image
            const base64Image = response.data.images[0];
            const buffer = Buffer.from(base64Image, 'base64');

            // Define the output file path dynamically
            const outputDir = path.resolve(__dirname, '../../data'); // Adjust as needed
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true }); // Ensure the directory exists
            }
            const filePath = path.join(outputDir, 'output.png');

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