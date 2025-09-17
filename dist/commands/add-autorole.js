"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../utils/embeds");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('add-autorole')
    .setDescription('Agregar un nuevo autorole al sistema')
    .addStringOption(option => option.setName('emoji')
    .setDescription('Emoji para reaccionar')
    .setRequired(true))
    .addRoleOption(option => option.setName('role')
    .setDescription('Rol a asignar')
    .setRequired(true))
    .addStringOption(option => option.setName('description')
    .setDescription('Descripción del rol')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    const emoji = interaction.options.getString('emoji', true);
    const role = interaction.options.getRole('role', true);
    const description = interaction.options.getString('description') || 'Sin descripción';
    // Get current config
    const config = await interaction.client.db.getGuildConfig(interaction.guildId);
    const currentAutoRoles = config?.autoRoles || [];
    // Check if emoji already exists
    const existingRole = currentAutoRoles.find((ar) => ar.emoji === emoji);
    if (existingRole) {
        return interaction.reply({
            embeds: [embeds_1.EmbedUtils.error('Emoji Ya Existe', `El emoji ${emoji} ya está asignado al rol <@&${existingRole.roleId}>`)],
            ephemeral: true
        });
    }
    // Check if role already exists
    const existingRoleId = currentAutoRoles.find((ar) => ar.roleId === role.id);
    if (existingRoleId) {
        return interaction.reply({
            embeds: [embeds_1.EmbedUtils.error('Rol Ya Existe', `El rol ${role} ya está asignado al emoji ${existingRoleId.emoji}`)],
            ephemeral: true
        });
    }
    // Add new autorole
    const newAutoRole = {
        emoji: emoji,
        roleId: role.id,
        roleName: role.name,
        description: description
    };
    const updatedAutoRoles = [...currentAutoRoles, newAutoRole];
    // Update configuration
    await interaction.client.db.updateGuildConfig(interaction.guildId, {
        autoRoles: updatedAutoRoles
    });
    // Success response
    const successEmbed = embeds_1.EmbedUtils.success('Autorole Agregado', `✅ **Emoji:** ${emoji}\n` +
        `🎭 **Rol:** ${role}\n` +
        `📝 **Descripción:** ${description}\n\n` +
        `Total de autoroles: ${updatedAutoRoles.length}`);
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
}
//# sourceMappingURL=add-autorole.js.map