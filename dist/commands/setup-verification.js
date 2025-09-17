"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../utils/embeds");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('setup-verification')
    .setDescription('Configurar sistema de verificación del servidor')
    .addStringOption(option => option.setName('method')
    .setDescription('Método de verificación')
    .setRequired(true)
    .addChoices({ name: 'Emoji', value: 'emoji' }, { name: 'Palabra Clave', value: 'keyword' }, { name: 'Botón', value: 'button' }))
    .addChannelOption(option => option.setName('channel')
    .setDescription('Canal de verificación')
    .setRequired(true)
    .addChannelTypes(discord_js_1.ChannelType.GuildText))
    .addRoleOption(option => option.setName('role')
    .setDescription('Rol a asignar tras verificación')
    .setRequired(true))
    .addStringOption(option => option.setName('message')
    .setDescription('Mensaje personalizado de verificación')
    .setRequired(false))
    .addStringOption(option => option.setName('keyword')
    .setDescription('Palabra clave (solo para método keyword)')
    .setRequired(false))
    .addStringOption(option => option.setName('emoji')
    .setDescription('Emoji específico (solo para método emoji)')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    const method = interaction.options.getString('method', true);
    const channel = interaction.options.getChannel('channel', true);
    const role = interaction.options.getRole('role', true);
    const customMessage = interaction.options.getString('message') || null;
    const keyword = interaction.options.getString('keyword') || null;
    const emoji = interaction.options.getString('emoji') || '✅';
    // Validations
    if (method === 'keyword' && !keyword) {
        return interaction.reply({
            embeds: [embeds_1.EmbedUtils.error('Error', 'Debes especificar una palabra clave para el método keyword')],
            ephemeral: true
        });
    }
    // Update configuration in database
    await interaction.client.db.updateGuildConfig(interaction.guildId, {
        verificationEnabled: true,
        verificationMethod: method,
        verificationChannelId: channel.id,
        verificationRoleId: role.id,
        verificationMessage: customMessage,
        verificationKeyword: keyword,
        verificationEmoji: emoji
    });
    // Create verification message
    let verificationEmbed;
    let verificationMessage = '';
    if (customMessage) {
        verificationEmbed = embeds_1.EmbedUtils.info('Verificación', customMessage);
    }
    else {
        switch (method) {
            case 'emoji':
                verificationMessage = `Para verificarte, reacciona con ${emoji} a este mensaje.`;
                break;
            case 'keyword':
                verificationMessage = `Para verificarte, escribe la palabra clave: **${keyword}**`;
                break;
            case 'button':
                verificationMessage = 'Para verificarte, haz clic en el botón de abajo.';
                break;
        }
        verificationEmbed = embeds_1.EmbedUtils.info('🔐 Sistema de Verificación', verificationMessage);
    }
    // Send verification message to channel
    const verificationChannel = interaction.guild.channels.cache.get(channel.id);
    if (method === 'button') {
        const verifyButton = new discord_js_1.ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('Verificarme')
            .setStyle(discord_js_1.ButtonStyle.Success)
            .setEmoji('✅');
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(verifyButton);
        await verificationChannel.send({
            embeds: [verificationEmbed],
            components: [row]
        });
    }
    else {
        const sentMessage = await verificationChannel.send({ embeds: [verificationEmbed] });
        if (method === 'emoji') {
            try {
                await sentMessage.react(emoji);
            }
            catch (error) {
                console.error('Error agregando reacción:', error);
            }
        }
    }
    // Success response
    const successEmbed = embeds_1.EmbedUtils.success('Verificación Configurada', `✅ **Método:** ${method}\n` +
        `📍 **Canal:** ${channel}\n` +
        `🎭 **Rol:** ${role}\n` +
        (method === 'keyword' ? `🔑 **Palabra clave:** ${keyword}\n` : '') +
        (method === 'emoji' ? `😀 **Emoji:** ${emoji}\n` : ''));
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
}
//# sourceMappingURL=setup-verification.js.map