import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('unverified-list')
  .setDescription('Mostrar lista de usuarios no verificados')
  .addIntegerOption(option =>
    option.setName('hours')
      .setDescription('Mostrar usuarios que se unieron hace X horas (por defecto: 24)')
      .setMinValue(1)
      .setMaxValue(168)
      .setRequired(false))
  .addIntegerOption(option =>
    option.setName('limit')
      .setDescription('Límite de usuarios a mostrar (por defecto: 20)')
      .setMinValue(5)
      .setMaxValue(50)
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const hours = interaction.options.getInteger('hours') || 24;
  const limit = interaction.options.getInteger('limit') || 20;

  try {
    // Get guild config to check verification role
    const config = await (interaction.client as any).db.getGuildConfig(interaction.guildId!);
    
    if (!config?.verificationEnabled || !config.verificationRoleId) {
      return interaction.editReply({
        embeds: [EmbedUtils.warning(
          'Sistema de Verificación Desactivado',
          'El sistema de verificación no está configurado en este servidor. Usa `/setup-verification` para configurarlo.'
        )]
      });
    }

    const guild = interaction.guild!;
    const verificationRole = guild.roles.cache.get(config.verificationRoleId);
    
    if (!verificationRole) {
      return interaction.editReply({
        embeds: [EmbedUtils.error('Error', 'El rol de verificación no existe. Reconfigura el sistema de verificación.')]
      });
    }

    // Get all members and filter unverified ones
    const members = await guild.members.fetch();
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    
    // Debug logging
    console.log(`Total members fetched: ${members.size}`);
    console.log(`Verification role ID: ${config.verificationRoleId}`);
    console.log(`Cutoff time: ${new Date(cutoffTime).toISOString()}`);
    
    let debugCount = 0;
    const unverifiedMembers = members
      .filter(member => {
        const isBot = member.user.bot;
        const hasVerificationRole = member.roles.cache.has(config.verificationRoleId!);
        const joinedBeforeCutoff = member.joinedTimestamp && member.joinedTimestamp < cutoffTime;
        
        // Debug logging for first few members
        if (debugCount < 5) {
          console.log(`Member ${member.user.tag}: bot=${isBot}, hasRole=${hasVerificationRole}, joinedBefore=${joinedBeforeCutoff}, joinedAt=${member.joinedTimestamp ? new Date(member.joinedTimestamp).toISOString() : 'unknown'}`);
          debugCount++;
        }
        
        if (isBot) return false;
        if (hasVerificationRole) return false;
        if (joinedBeforeCutoff) return false;
        return true;
      })
      .sort((a, b) => (a.joinedTimestamp || 0) - (b.joinedTimestamp || 0))
      .first(limit);
      
    console.log(`Unverified members found: ${unverifiedMembers.length}`);

    if (unverifiedMembers.length === 0) {
      return interaction.editReply({
        embeds: [EmbedUtils.success(
          'Sin Usuarios No Verificados',
          `No hay usuarios sin verificar que se hayan unido en las últimas ${hours} horas.`
        )]
      });
    }

    // Create embed with unverified users
    const embed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle(`👥 Usuarios No Verificados (${unverifiedMembers.length})`)
      .setDescription(`Usuarios que se unieron en las últimas ${hours} horas`)
      .setTimestamp()
      .setFooter({ text: `Mostrando ${unverifiedMembers.length} de ${members.filter(m => !m.user.bot).size} miembros` });

    let description = '';
    unverifiedMembers.forEach((member, index) => {
      const joinTime = member.joinedTimestamp 
        ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
        : 'Desconocido';
      
      description += `${index + 1}. **${member.user.tag}** ${member}\n📅 Se unió: ${joinTime}\n`;
      
      if (index < unverifiedMembers.length - 1) description += '\n';
    });

    // Split into multiple embeds if too long
    if (description.length > 2000) {
      const chunks = [];
      const users = Array.from(unverifiedMembers.values());
      const chunkSize = 10;
      
      for (let i = 0; i < users.length; i += chunkSize) {
        const chunk = users.slice(i, i + chunkSize);
        let chunkDesc = '';
        
        chunk.forEach((member: any, index: number) => {
          const globalIndex = i + index + 1;
          const joinTime = member.joinedTimestamp 
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
            : 'Desconocido';
          
          chunkDesc += `${globalIndex}. **${member.user.tag}** ${member}\n📅 Se unió: ${joinTime}\n`;
          if (index < chunk.length - 1) chunkDesc += '\n';
        });
        
        chunks.push(chunkDesc);
      }
      
      embed.setDescription(chunks[0]);
      await interaction.editReply({ embeds: [embed] });
      
      // Send additional embeds if needed
      for (let i = 1; i < chunks.length; i++) {
        const followUpEmbed = new EmbedBuilder()
          .setColor('#ff9900')
          .setTitle(`👥 Usuarios No Verificados (Continuación ${i + 1})`)
          .setDescription(chunks[i])
          .setTimestamp();
          
        await interaction.followUp({ embeds: [followUpEmbed], ephemeral: true });
      }
    } else {
      embed.setDescription(description);
      await interaction.editReply({ embeds: [embed] });
    }

  } catch (error) {
    console.error('Error obteniendo usuarios no verificados:', error);
    await interaction.editReply({
      embeds: [EmbedUtils.error('Error', 'Ocurrió un error al obtener la lista de usuarios no verificados.')]
    });
  }
}