import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('setup-autoroles')
  .setDescription('Configurar sistema de autoroles por reacciones')
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('Canal donde se enviará el mensaje de autoroles')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText))
  .addStringOption(option =>
    option.setName('title')
      .setDescription('Título del mensaje de autoroles')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('description')
      .setDescription('Descripción del sistema de autoroles')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  // Defer the reply immediately to prevent timeout
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.options.getChannel('channel', true);
  const title = interaction.options.getString('title') || 'Selecciona tus roles';
  const description = interaction.options.getString('description') || 
    'Reacciona con los emojis correspondientes para obtener los roles deseados.';

  // Get current guild config to preserve auto roles
  const config = await (interaction.client as any).db.getGuildConfig(interaction.guildId!);
  const currentAutoRoles = config?.autoRoles || [];

  if (currentAutoRoles.length === 0) {
    return interaction.editReply({
      embeds: [EmbedUtils.warning(
        'Sin Autoroles Configurados',
        'Primero debes agregar autoroles usando `/add-autorole` antes de configurar el mensaje.'
      )]
    });
  }

  // Build autorole list for description
  const rolesList = currentAutoRoles.map((autoRole: any) => 
    `${autoRole.emoji} **${autoRole.roleName}** - ${autoRole.description || 'Sin descripción'}`
  ).join('\n');

  const fullDescription = `${description}\n\n${rolesList}`;

  // Create autoroles embed using the new customization system
  const autoRolesEmbed = config?.autoRoleEmbedEnabled !== false
    ? EmbedUtils.autorole(title, fullDescription, config)
    : new EmbedBuilder()
        .setColor('#aa55ff')
        .setTitle(title)
        .setDescription(fullDescription)
        .setTimestamp();

  // Send autoroles message
  const autoRolesChannel = interaction.guild!.channels.cache.get(channel.id) as any;
  const sentMessage = await autoRolesChannel.send({ embeds: [autoRolesEmbed] });

  // Add reactions for each autorole
  for (const autoRole of currentAutoRoles) {
    try {
      await sentMessage.react(autoRole.emoji);
    } catch (error) {
      console.error(`Error agregando reacción ${autoRole.emoji}:`, error);
    }
  }

  // Update configuration with message ID
  await (interaction.client as any).db.updateGuildConfig(interaction.guildId!, {
    autoRoleMessageId: sentMessage.id
  });

  // Success response
  const successEmbed = EmbedUtils.success(
    'Autoroles Configurado',
    `✅ Mensaje de autoroles enviado en ${channel}\n` +
    `🎭 ${currentAutoRoles.length} roles configurados\n` +
    `📝 ID del mensaje: ${sentMessage.id}`
  );

  await interaction.editReply({ embeds: [successEmbed] });
}