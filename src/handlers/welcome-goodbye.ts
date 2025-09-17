import { GuildMember, TextChannel } from 'discord.js';
import { ExtendedClient } from '../types/discord';
import { EmbedUtils } from '../utils/embeds';

export class WelcomeGoodbyeHandler {
  constructor(private client: ExtendedClient) {}

  async handleMemberJoin(member: GuildMember) {
    if (member.user.bot) return;

    try {
      const config = await this.client.db.getGuildConfig(member.guild.id);
      
      if (!config) return;

      // Handle welcome channel message
      if (config.welcomeEnabled && config.welcomeChannelId) {
        await this.sendWelcomeMessage(member, config);
      }

      // Handle welcome DM
      if (config.welcomeDmEnabled) {
        await this.sendWelcomeDM(member, config);
      }

    } catch (error) {
      this.client.logger.error('Error en manejador de bienvenida:', { error });
    }
  }

  async handleMemberLeave(member: GuildMember) {
    if (member.user.bot) return;

    try {
      const config = await this.client.db.getGuildConfig(member.guild.id);
      
      if (!config?.goodbyeEnabled || !config.goodbyeChannelId) return;

      const channel = member.guild.channels.cache.get(config.goodbyeChannelId) as TextChannel;
      if (!channel) return;

      const message = EmbedUtils.replaceVariables(
        config.goodbyeMessage || '👋 **{user}** se ha ido de **{server}**.',
        member
      );

      // Check if farewell embeds are enabled
      if (config.goodbyeEmbedEnabled !== false) {
        const embed = EmbedUtils.farewell(
          'Miembro se fue',
          message,
          config,
          member
        );

        await channel.send({ embeds: [embed] });
      } else {
        // Send as plain text if embeds are disabled
        await channel.send(message);
      }

      this.client.logger.info(`Mensaje de despedida enviado para ${member.user.tag}`, {
        guildId: member.guild.id,
        userId: member.user.id
      });

    } catch (error) {
      this.client.logger.error('Error enviando mensaje de despedida:', { error });
    }
  }

  private async sendWelcomeMessage(member: GuildMember, config: any) {
    try {
      const channel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
      if (!channel) return;

      const message = EmbedUtils.replaceVariables(
        config.welcomeMessage || '¡Bienvenido {user} a **{server}**! 🎉',
        member
      );

      // Check if welcome embeds are enabled
      if (config.welcomeEmbedEnabled !== false) {
        const embed = EmbedUtils.welcome(
          'Nuevo Miembro',
          message,
          config,
          member
        );

        await channel.send({ embeds: [embed] });
      } else {
        // Send as plain text if embeds are disabled
        await channel.send(message);
      }

      this.client.logger.info(`Mensaje de bienvenida enviado para ${member.user.tag}`, {
        guildId: member.guild.id,
        userId: member.user.id
      });

    } catch (error) {
      this.client.logger.error('Error enviando mensaje de bienvenida:', { error });
    }
  }

  private async sendWelcomeDM(member: GuildMember, config: any) {
    try {
      const message = EmbedUtils.replaceVariables(
        config.welcomeDmMessage || 
        '¡Hola {user}! 👋\n\nBienvenido a **{server}**. Si tienes alguna pregunta, no dudes en contactar a los moderadores.',
        member
      );

      // Check if welcome embeds are enabled
      if (config.welcomeEmbedEnabled !== false) {
        const embed = EmbedUtils.welcome(
          `¡Bienvenido a ${member.guild.name}!`,
          message,
          config,
          member
        );

        await member.send({ embeds: [embed] });
      } else {
        // Send as plain text if embeds are disabled
        await member.send(message);
      }

      this.client.logger.info(`DM de bienvenida enviado a ${member.user.tag}`, {
        guildId: member.guild.id,
        userId: member.user.id
      });

    } catch (error) {
      this.client.logger.warn(`No se pudo enviar DM de bienvenida a ${member.user.tag}`, { error });
    }
  }

  private replaceVariables(message: string, member: GuildMember, mention: boolean = false): string {
    return message
      .replace(/{user}/g, mention ? member.toString() : member.user.username)
      .replace(/{user_tag}/g, member.user.tag)
      .replace(/{user_mention}/g, member.toString())
      .replace(/{server}/g, member.guild.name)
      .replace(/{member_count}/g, member.guild.memberCount.toString())
      .replace(/{user_avatar}/g, member.user.displayAvatarURL({ size: 256 }));
  }
}