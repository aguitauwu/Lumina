import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('customize-embeds')
  .setDescription('Personalizar la apariencia de los embeds del bot')
  .addStringOption(option =>
    option.setName('color')
      .setDescription('Color en formato hexadecimal (ej: #00ff00)')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('thumbnail')
      .setDescription('URL de imagen para thumbnail (usa {user_avatar} para avatar del usuario)')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('footer')
      .setDescription('Texto del pie de página personalizado')
      .setRequired(false))
  .addBooleanOption(option =>
    option.setName('reset')
      .setDescription('Resetear a configuración por defecto')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const color = interaction.options.getString('color');
  const thumbnail = interaction.options.getString('thumbnail');
  const footer = interaction.options.getString('footer');
  const reset = interaction.options.getBoolean('reset');

  // Validation for color
  if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'El color debe estar en formato hexadecimal válido (ej: #00ff00)')]
    });
  }

  // Validation for thumbnail URL
  if (thumbnail && !thumbnail.includes('{user_avatar}') && !isValidUrl(thumbnail)) {
    return interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'La URL del thumbnail debe ser válida o usar {user_avatar}')]
    });
  }

  let updates = {};
  let changes = [];

  if (reset) {
    updates = {
      embedColor: '#0099ff',
      embedThumbnail: null,
      embedFooter: null
    };
    changes.push('✅ Configuración de embeds reseteada a valores por defecto');
  } else {
    if (color) {
      (updates as any).embedColor = color;
      changes.push(`🎨 **Color:** ${color}`);
    }
    if (thumbnail !== null) {
      (updates as any).embedThumbnail = thumbnail;
      if (thumbnail) {
        changes.push(`🖼️ **Thumbnail:** ${thumbnail.includes('{user_avatar}') ? 'Avatar del usuario' : 'URL personalizada'}`);
      } else {
        changes.push(`🖼️ **Thumbnail:** Removido`);
      }
    }
    if (footer !== null) {
      (updates as any).embedFooter = footer;
      if (footer) {
        changes.push(`📝 **Footer:** ${footer}`);
      } else {
        changes.push(`📝 **Footer:** Removido`);
      }
    }

    if (changes.length === 0) {
      return interaction.editReply({
        embeds: [EmbedUtils.warning('Sin Cambios', 'No se especificaron cambios. Usa las opciones disponibles o `reset:true` para resetear.')]
      });
    }
  }

  // Update configuration
  await (interaction.client as any).db.updateGuildConfig(interaction.guildId!, updates);

  // Get updated config for preview
  const config = await (interaction.client as any).db.getGuildConfig(interaction.guildId!);

  // Create preview embed
  const previewEmbed = EmbedUtils.success(
    'Embeds Personalizados',
    changes.join('\n') + '\n\n**Este es un ejemplo de cómo se verán los embeds ahora.**',
    config
  );

  await interaction.editReply({ embeds: [previewEmbed] });
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}