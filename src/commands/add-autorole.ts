import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('add-autorole')
  .setDescription('Agregar un nuevo autorole al sistema')
  .addStringOption(option =>
    option.setName('emoji')
      .setDescription('Emoji para reaccionar')
      .setRequired(true))
  .addRoleOption(option =>
    option.setName('role')
      .setDescription('Rol a asignar')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('description')
      .setDescription('Descripción del rol')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const emoji = interaction.options.getString('emoji', true);
  const role = interaction.options.getRole('role', true);
  const description = interaction.options.getString('description') || 'Sin descripción';

  // Get current config
  const config = await (interaction.client as any).db.getGuildConfig(interaction.guildId!);
  const currentAutoRoles = config?.autoRoles || [];

  // Check if emoji already exists
  const existingRole = currentAutoRoles.find((ar: any) => ar.emoji === emoji);
  if (existingRole) {
    return interaction.reply({
      embeds: [EmbedUtils.error(
        'Emoji Ya Existe',
        `El emoji ${emoji} ya está asignado al rol <@&${existingRole.roleId}>`
      )],
      ephemeral: true
    });
  }

  // Check if role already exists
  const existingRoleId = currentAutoRoles.find((ar: any) => ar.roleId === role.id);
  if (existingRoleId) {
    return interaction.reply({
      embeds: [EmbedUtils.error(
        'Rol Ya Existe',
        `El rol ${role} ya está asignado al emoji ${existingRoleId.emoji}`
      )],
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
  await (interaction.client as any).db.updateGuildConfig(interaction.guildId!, {
    autoRoles: updatedAutoRoles
  });

  // Success response
  const successEmbed = EmbedUtils.success(
    'Autorole Agregado',
    `✅ **Emoji:** ${emoji}\n` +
    `🎭 **Rol:** ${role}\n` +
    `📝 **Descripción:** ${description}\n\n` +
    `Total de autoroles: ${updatedAutoRoles.length}`
  );

  await interaction.reply({ embeds: [successEmbed], ephemeral: true });
}