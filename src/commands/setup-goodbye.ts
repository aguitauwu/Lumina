import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits,
  ChannelType
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('setup-goodbye')
  .setDescription('Configurar mensajes de despedida cuando un miembro se va')
  .addBooleanOption(option =>
    option.setName('enabled')
      .setDescription('Activar/desactivar mensajes de despedida')
      .setRequired(true))
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('Canal donde enviar mensajes de despedida')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false))
  .addStringOption(option =>
    option.setName('message')
      .setDescription('Mensaje personalizado (usa {user} para nombre, {server} para servidor)')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const enabled = interaction.options.getBoolean('enabled', true);
  const channel = interaction.options.getChannel('channel');
  const message = interaction.options.getString('message');

  // Validation
  if (enabled && !channel) {
    return interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'Debes especificar un canal cuando activas las despedidas.')]
    });
  }

  // Default message
  const defaultMessage = '👋 **{user}** se ha ido de **{server}**.\nEsperamos verte pronto de vuelta!';

  // Update configuration
  const updates = {
    goodbyeEnabled: enabled,
    goodbyeChannelId: channel?.id || null,
    goodbyeMessage: message || defaultMessage
  };

  await (interaction.client as any).db.updateGuildConfig(interaction.guildId!, updates);

  // Success response
  const successEmbed = EmbedUtils.success(
    'Despedidas Configuradas',
    `✅ **Estado:** ${enabled ? 'Activado' : 'Desactivado'}\n` +
    (enabled ? `📍 **Canal:** ${channel}\n` : '') +
    `\n**Variables disponibles:**\n` +
    `• \`{user}\` - Nombre del usuario\n` +
    `• \`{server}\` - Nombre del servidor\n` +
    `• \`{member_count}\` - Número de miembros restantes`
  );

  await interaction.editReply({ embeds: [successEmbed] });
}