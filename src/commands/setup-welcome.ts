import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits,
  ChannelType
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('setup-welcome')
  .setDescription('Configurar mensajes de bienvenida para nuevos miembros')
  .addBooleanOption(option =>
    option.setName('enabled')
      .setDescription('Activar/desactivar mensajes de bienvenida')
      .setRequired(true))
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('Canal donde enviar mensajes de bienvenida')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false))
  .addStringOption(option =>
    option.setName('message')
      .setDescription('Mensaje personalizado (usa {user} para mencionar, {server} para nombre del servidor)')
      .setRequired(false))
  .addBooleanOption(option =>
    option.setName('dm_enabled')
      .setDescription('Enviar mensaje directo al usuario')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('dm_message')
      .setDescription('Mensaje DM personalizado (usa {user}, {server})')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const enabled = interaction.options.getBoolean('enabled', true);
  const channel = interaction.options.getChannel('channel');
  const message = interaction.options.getString('message');
  const dmEnabled = interaction.options.getBoolean('dm_enabled');
  const dmMessage = interaction.options.getString('dm_message');

  // Validation
  if (enabled && !channel) {
    return interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'Debes especificar un canal cuando activas las bienvenidas.')]
    });
  }

  // Default messages
  const defaultMessage = '¡Bienvenido {user} a **{server}**! 🎉\nEsperamos que disfrutes tu estadía aquí.';
  const defaultDmMessage = '¡Hola {user}! 👋\n\nBienvenido a **{server}**. Si tienes alguna pregunta, no dudes en contactar a los moderadores.';

  // Update configuration
  const updates = {
    welcomeEnabled: enabled,
    welcomeChannelId: channel?.id || null,
    welcomeMessage: message || defaultMessage,
    welcomeDmEnabled: dmEnabled !== null ? dmEnabled : true,
    welcomeDmMessage: dmMessage || defaultDmMessage
  };

  await (interaction.client as any).db.updateGuildConfig(interaction.guildId!, updates);

  // Success response
  const successEmbed = EmbedUtils.success(
    'Bienvenidas Configuradas',
    `✅ **Estado:** ${enabled ? 'Activado' : 'Desactivado'}\n` +
    (enabled ? `📍 **Canal:** ${channel}\n` : '') +
    `📨 **DM habilitado:** ${updates.welcomeDmEnabled ? 'Sí' : 'No'}\n\n` +
    `**Variables disponibles:**\n` +
    `• \`{user}\` - Menciona al usuario\n` +
    `• \`{server}\` - Nombre del servidor\n` +
    `• \`{member_count}\` - Número de miembros`
  );

  await interaction.editReply({ embeds: [successEmbed] });
}