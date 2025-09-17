"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const embeds_1 = require("../utils/embeds");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('config')
    .setDescription('Ver la configuración actual del servidor')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    const config = await interaction.client.db.getGuildConfig(interaction.guildId);
    if (!config) {
        return interaction.reply({
            embeds: [embeds_1.EmbedUtils.info('Sin Configuración', 'Este servidor aún no tiene configuración. Usa los comandos de setup para configurar el bot.')],
            ephemeral: true
        });
    }
    const configEmbed = new discord_js_1.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`⚙️ Configuración de ${interaction.guild.name}`)
        .setTimestamp();
    // Verification section
    configEmbed.addFields({
        name: '🔐 Sistema de Verificación',
        value: config.verificationEnabled
            ? `**Estado:** ✅ Activado\n` +
                `**Método:** ${config.verificationMethod}\n` +
                `**Canal:** <#${config.verificationChannelId}>\n` +
                `**Rol:** <@&${config.verificationRoleId}>\n` +
                (config.verificationKeyword ? `**Palabra clave:** ${config.verificationKeyword}\n` : '') +
                (config.verificationEmoji ? `**Emoji:** ${config.verificationEmoji}\n` : '')
            : '❌ Desactivado',
        inline: false
    });
    // Auto-roles section
    configEmbed.addFields({
        name: '🎭 Sistema de Autoroles',
        value: config.autoRoles && config.autoRoles.length > 0
            ? `**Roles configurados:** ${config.autoRoles.length}\n` +
                `**Mensaje ID:** ${config.autoRoleMessageId || 'No configurado'}\n\n` +
                config.autoRoles.slice(0, 5).map((ar) => `${ar.emoji} **${ar.roleName}** - ${ar.description}`).join('\n') +
                (config.autoRoles.length > 5 ? `\n... y ${config.autoRoles.length - 5} más` : '')
            : '❌ Sin autoroles configurados',
        inline: false
    });
    // Auto-ban section
    configEmbed.addFields({
        name: '🔨 Sistema de Auto-Ban',
        value: config.autoBanEnabled
            ? `**Estado:** ✅ Activado\n**Retraso:** ${config.autoBanDelayHours} horas`
            : '❌ Desactivado',
        inline: false
    });
    // Database info
    configEmbed.addFields({
        name: '📊 Información',
        value: `**Creado:** <t:${Math.floor(new Date(config.createdAt).getTime() / 1000)}:R>\n` +
            `**Actualizado:** <t:${Math.floor(new Date(config.updatedAt).getTime() / 1000)}:R>`,
        inline: false
    });
    await interaction.reply({ embeds: [configEmbed], ephemeral: true });
}
//# sourceMappingURL=config.js.map