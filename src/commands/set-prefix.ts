import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('set-prefix')
  .setDescription('Cambiar el prefijo para comandos de texto del bot')
  .addStringOption(option =>
    option.setName('prefix')
      .setDescription('Nuevo prefijo (máximo 3 caracteres)')
      .setRequired(true)
      .setMaxLength(3))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const newPrefix = interaction.options.getString('prefix', true);

  // Validation
  if (newPrefix.length > 3) {
    return interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'El prefijo no puede tener más de 3 caracteres.')]
    });
  }

  if (newPrefix.includes(' ')) {
    return interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'El prefijo no puede contener espacios.')]
    });
  }

  // Update configuration
  await (interaction.client as any).db.updateGuildConfig(interaction.guildId!, {
    prefix: newPrefix
  });

  // Success response
  const successEmbed = EmbedUtils.success(
    'Prefijo Actualizado',
    `✅ El prefijo ha sido cambiado a: \`${newPrefix}\`\n\n` +
    `Ahora puedes usar comandos como:\n` +
    `• \`${newPrefix}help\` - Ver ayuda\n` +
    `• \`${newPrefix}unverified\` - Lista de no verificados\n` +
    `• \`${newPrefix}ping\` - Comprobar latencia`
  );

  await interaction.editReply({ embeds: [successEmbed] });
}