import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('setup-verification')
  .setDescription('Configurar sistema de verificación del servidor')
  .addStringOption(option =>
    option.setName('method')
      .setDescription('Método de verificación')
      .setRequired(true)
      .addChoices(
        { name: 'Emoji', value: 'emoji' },
        { name: 'Palabra Clave', value: 'keyword' },
        { name: 'Botón', value: 'button' }
      ))
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('Canal de verificación')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText))
  .addRoleOption(option =>
    option.setName('role')
      .setDescription('Rol a asignar tras verificación')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('message')
      .setDescription('Mensaje personalizado de verificación')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('keyword')
      .setDescription('Palabra clave (solo para método keyword)')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('emoji')
      .setDescription('Emoji específico (solo para método emoji)')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  // Defer the reply immediately to prevent timeout
  await interaction.deferReply({ ephemeral: true });

  const method = interaction.options.getString('method', true) as 'emoji' | 'keyword' | 'button';
  const channel = interaction.options.getChannel('channel', true);
  const role = interaction.options.getRole('role', true);
  const customMessage = interaction.options.getString('message') || null;
  const keyword = interaction.options.getString('keyword') || null;
  const emoji = interaction.options.getString('emoji') || '✅';

  // Validations
  if (method === 'keyword' && !keyword) {
    return interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'Debes especificar una palabra clave para el método keyword')]
    });
  }

  // Update configuration in database
  await (interaction.client as any).db.updateGuildConfig(interaction.guildId!, {
    verificationEnabled: true,
    verificationMethod: method,
    verificationChannelId: channel.id,
    verificationRoleId: role.id,
    verificationMessage: customMessage,
    verificationKeyword: keyword,
    verificationEmoji: emoji
  });

  // Create verification message
  let verificationEmbed: EmbedBuilder;
  let verificationMessage = '';

  if (customMessage) {
    verificationEmbed = EmbedUtils.info('Verificación', customMessage);
  } else {
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
    verificationEmbed = EmbedUtils.info('🔐 Sistema de Verificación', verificationMessage);
  }

  // Send verification message to channel
  const verificationChannel = interaction.guild!.channels.cache.get(channel.id) as any;
  
  if (method === 'button') {
    const verifyButton = new ButtonBuilder()
      .setCustomId('verify_button')
      .setLabel('Verificarme')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(verifyButton);

    await verificationChannel.send({ 
      embeds: [verificationEmbed], 
      components: [row] 
    });
  } else {
    const sentMessage = await verificationChannel.send({ embeds: [verificationEmbed] });
    
    if (method === 'emoji') {
      try {
        await sentMessage.react(emoji);
      } catch (error) {
        console.error('Error agregando reacción:', error);
      }
    }
  }

  // Success response
  const successEmbed = EmbedUtils.success(
    'Verificación Configurada',
    `✅ **Método:** ${method}\n` +
    `📍 **Canal:** ${channel}\n` +
    `🎭 **Rol:** ${role}\n` +
    (method === 'keyword' ? `🔑 **Palabra clave:** ${keyword}\n` : '') +
    (method === 'emoji' ? `😀 **Emoji:** ${emoji}\n` : '')
  );

  await interaction.editReply({ embeds: [successEmbed] });
}