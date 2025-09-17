import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('Ver la configuración actual del servidor')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const config = await (interaction.client as any).db.getGuildConfig(interaction.guildId!);

  if (!config) {
    return interaction.reply({
      embeds: [EmbedUtils.info(
        'Sin Configuración',
        'Este servidor aún no tiene configuración. Usa los comandos de setup para configurar el bot.'
      )],
      ephemeral: true
    });
  }

  const configEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`⚙️ Configuración de ${interaction.guild!.name}`)
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
        config.autoRoles.slice(0, 5).map((ar: any) => 
          `${ar.emoji} **${ar.roleName}** - ${ar.description}`
        ).join('\n') +
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