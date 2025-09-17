"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../utils/embeds");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('setup-autoroles')
    .setDescription('Configurar sistema de autoroles por reacciones')
    .addChannelOption(option => option.setName('channel')
    .setDescription('Canal donde se enviará el mensaje de autoroles')
    .setRequired(true)
    .addChannelTypes(discord_js_1.ChannelType.GuildText))
    .addStringOption(option => option.setName('title')
    .setDescription('Título del mensaje de autoroles')
    .setRequired(false))
    .addStringOption(option => option.setName('description')
    .setDescription('Descripción del sistema de autoroles')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    const channel = interaction.options.getChannel('channel', true);
    const title = interaction.options.getString('title') || 'Selecciona tus roles';
    const description = interaction.options.getString('description') ||
        'Reacciona con los emojis correspondientes para obtener los roles deseados.';
    // Get current guild config to preserve auto roles
    const config = await interaction.client.db.getGuildConfig(interaction.guildId);
    const currentAutoRoles = config?.autoRoles || [];
    if (currentAutoRoles.length === 0) {
        return interaction.reply({
            embeds: [embeds_1.EmbedUtils.warning('Sin Autoroles Configurados', 'Primero debes agregar autoroles usando `/add-autorole` antes de configurar el mensaje.')],
            ephemeral: true
        });
    }
    // Create autoroles embed
    const autoRolesEmbed = new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
    // Add fields for each autorole
    for (const autoRole of currentAutoRoles) {
        autoRolesEmbed.addFields({
            name: `${autoRole.emoji} ${autoRole.roleName}`,
            value: autoRole.description || 'Sin descripción',
            inline: true
        });
    }
    // Send autoroles message
    const autoRolesChannel = interaction.guild.channels.cache.get(channel.id);
    const sentMessage = await autoRolesChannel.send({ embeds: [autoRolesEmbed] });
    // Add reactions for each autorole
    for (const autoRole of currentAutoRoles) {
        try {
            await sentMessage.react(autoRole.emoji);
        }
        catch (error) {
            console.error(`Error agregando reacción ${autoRole.emoji}:`, error);
        }
    }
    // Update configuration with message ID
    await interaction.client.db.updateGuildConfig(interaction.guildId, {
        autoRoleMessageId: sentMessage.id
    });
    // Success response
    const successEmbed = embeds_1.EmbedUtils.success('Autoroles Configurado', `✅ Mensaje de autoroles enviado en ${channel}\n` +
        `🎭 ${currentAutoRoles.length} roles configurados\n` +
        `📝 ID del mensaje: ${sentMessage.id}`);
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
}
//# sourceMappingURL=setup-autoroles.js.map