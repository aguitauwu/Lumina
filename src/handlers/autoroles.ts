import { MessageReaction, User, GuildMember } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export class AutoRoleHandler {
  constructor(private client: ExtendedClient) {}

  async handleReactionAdd(reaction: MessageReaction, user: User) {
    if (user.bot) return;

    try {
      const config = await this.client.db.getGuildConfig(reaction.message.guildId!);
      
      if (!config?.autoRoles?.length || config.autoRoleMessageId !== reaction.message.id) {
        return;
      }

      const autoRole = this.findAutoRole(config.autoRoles, reaction);
      if (!autoRole) return;

      const guild = reaction.message.guild!;
      const member = guild.members.cache.get(user.id) ?? 
                    await guild.members.fetch(user.id).catch(() => null);
      const role = guild.roles.cache.get(autoRole.roleId);

      if (!member || !role) return;

      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role);
        this.client.logger.info(`Rol agregado: ${role.name} a ${user.tag}`, {
          guildId: guild.id,
          userId: user.id,
          roleId: role.id,
          emoji: autoRole.emoji
        });
      }
    } catch (error) {
      this.client.logger.error('Error en autoroles (agregar)', { error });
    }
  }

  async handleReactionRemove(reaction: MessageReaction, user: User) {
    if (user.bot) return;

    try {
      const config = await this.client.db.getGuildConfig(reaction.message.guildId!);
      
      if (!config?.autoRoles?.length || config.autoRoleMessageId !== reaction.message.id) {
        return;
      }

      const autoRole = this.findAutoRole(config.autoRoles, reaction);
      if (!autoRole) return;

      const guild = reaction.message.guild!;
      const member = guild.members.cache.get(user.id) ?? 
                    await guild.members.fetch(user.id).catch(() => null);
      const role = guild.roles.cache.get(autoRole.roleId);

      if (!member || !role) return;

      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        this.client.logger.info(`Rol removido: ${role.name} de ${user.tag}`, {
          guildId: guild.id,
          userId: user.id,
          roleId: role.id,
          emoji: autoRole.emoji
        });
      }
    } catch (error) {
      this.client.logger.error('Error en autoroles (remover)', { error });
    }
  }

  private findAutoRole(autoRoles: any[], reaction: MessageReaction) {
    const reactionEmoji = reaction.emoji.toString();
    return autoRoles.find(ar => {
      if (reaction.emoji.id) {
        // Custom emoji
        return ar.emoji === reactionEmoji ||
               ar.emoji === reaction.emoji.id ||
               ar.emoji === `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
      }
      // Unicode emoji
      return ar.emoji === reactionEmoji || ar.emoji === reaction.emoji.name;
    });
  }
}