import { EmbedBuilder, ColorResolvable, GuildMember } from 'discord.js';
import type { GuildConfig } from '../types/discord';

export class EmbedUtils {
  static success(title: string, description?: string, config?: GuildConfig): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.embedColor as ColorResolvable) || '#00ff00')
      .setTitle(`✅ ${title}`)
      .setDescription(description || '')
      .setTimestamp();

    if (config?.embedThumbnail && !config.embedThumbnail.includes('{user_avatar}')) {
      embed.setThumbnail(config.embedThumbnail);
    }

    if (config?.embedFooter) {
      embed.setFooter({ text: config.embedFooter });
    }

    return embed;
  }

  static error(title: string, description?: string, config?: GuildConfig): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('#ff0000' as ColorResolvable)
      .setTitle(`❌ ${title}`)
      .setDescription(description || '')
      .setTimestamp();

    if (config?.embedFooter) {
      embed.setFooter({ text: config.embedFooter });
    }

    return embed;
  }

  static info(title: string, description?: string, config?: GuildConfig): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.embedColor as ColorResolvable) || '#0099ff')
      .setTitle(`ℹ️ ${title}`)
      .setDescription(description || '')
      .setTimestamp();

    if (config?.embedThumbnail && !config.embedThumbnail.includes('{user_avatar}')) {
      embed.setThumbnail(config.embedThumbnail);
    }

    if (config?.embedFooter) {
      embed.setFooter({ text: config.embedFooter });
    }

    return embed;
  }

  static warning(title: string, description?: string, config?: GuildConfig): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('#ff9900' as ColorResolvable)
      .setTitle(`⚠️ ${title}`)
      .setDescription(description || '')
      .setTimestamp();

    if (config?.embedThumbnail && !config.embedThumbnail.includes('{user_avatar}')) {
      embed.setThumbnail(config.embedThumbnail);
    }

    if (config?.embedFooter) {
      embed.setFooter({ text: config.embedFooter });
    }

    return embed;
  }

  static custom(config?: GuildConfig): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.embedColor as ColorResolvable) || '#0099ff')
      .setTimestamp();

    if (config?.embedThumbnail && !config.embedThumbnail.includes('{user_avatar}')) {
      embed.setThumbnail(config.embedThumbnail);
    }

    if (config?.embedFooter) {
      embed.setFooter({ text: config.embedFooter });
    }

    return embed;
  }

  // Welcome embed with specific customization
  static welcome(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.welcomeEmbedColor as ColorResolvable) || '#00ff00')
      .setTitle(config?.welcomeEmbedTitle || `🎉 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail
    if (config?.welcomeEmbedThumbnail) {
      if (config.welcomeEmbedThumbnail.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (!config.welcomeEmbedThumbnail.includes('{user_avatar}')) {
        embed.setThumbnail(config.welcomeEmbedThumbnail);
      }
    }

    // Handle image
    if (config?.welcomeEmbedImage) {
      if (config.welcomeEmbedImage.includes('{user_avatar}') && member) {
        embed.setImage(member.user.displayAvatarURL({ size: 512 }));
      } else if (!config.welcomeEmbedImage.includes('{user_avatar}')) {
        embed.setImage(config.welcomeEmbedImage);
      }
    }

    // Handle footer
    if (config?.welcomeEmbedFooter) {
      embed.setFooter({ text: config.welcomeEmbedFooter });
    }

    return embed;
  }

  // Farewell embed with specific customization
  static farewell(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.goodbyeEmbedColor as ColorResolvable) || '#ff4444')
      .setTitle(config?.goodbyeEmbedTitle || `👋 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail
    if (config?.goodbyeEmbedThumbnail) {
      if (config.goodbyeEmbedThumbnail.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (!config.goodbyeEmbedThumbnail.includes('{user_avatar}')) {
        embed.setThumbnail(config.goodbyeEmbedThumbnail);
      }
    }

    // Handle image
    if (config?.goodbyeEmbedImage) {
      if (config.goodbyeEmbedImage.includes('{user_avatar}') && member) {
        embed.setImage(member.user.displayAvatarURL({ size: 512 }));
      } else if (!config.goodbyeEmbedImage.includes('{user_avatar}')) {
        embed.setImage(config.goodbyeEmbedImage);
      }
    }

    // Handle footer
    if (config?.goodbyeEmbedFooter) {
      embed.setFooter({ text: config.goodbyeEmbedFooter });
    }

    return embed;
  }

  // Verification embed with specific customization
  static verification(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.verificationEmbedColor as ColorResolvable) || '#0099ff')
      .setTitle(config?.verificationEmbedTitle || `🔐 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail
    if (config?.verificationEmbedThumbnail) {
      if (config.verificationEmbedThumbnail.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (!config.verificationEmbedThumbnail.includes('{user_avatar}')) {
        embed.setThumbnail(config.verificationEmbedThumbnail);
      }
    }

    // Handle image
    if (config?.verificationEmbedImage) {
      if (config.verificationEmbedImage.includes('{user_avatar}') && member) {
        embed.setImage(member.user.displayAvatarURL({ size: 512 }));
      } else if (!config.verificationEmbedImage.includes('{user_avatar}')) {
        embed.setImage(config.verificationEmbedImage);
      }
    }

    // Handle footer
    if (config?.verificationEmbedFooter) {
      embed.setFooter({ text: config.verificationEmbedFooter });
    }

    return embed;
  }

  // Verification DM embed with specific customization
  static verificationDM(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.verificationDmEmbedColor as ColorResolvable) || '#00aaff')
      .setTitle(`🔐 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail
    if (config?.verificationDmEmbedThumbnail) {
      if (config.verificationDmEmbedThumbnail.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (!config.verificationDmEmbedThumbnail.includes('{user_avatar}')) {
        embed.setThumbnail(config.verificationDmEmbedThumbnail);
      }
    }

    // Handle image
    if (config?.verificationDmEmbedImage) {
      if (config.verificationDmEmbedImage.includes('{user_avatar}') && member) {
        embed.setImage(member.user.displayAvatarURL({ size: 512 }));
      } else if (!config.verificationDmEmbedImage.includes('{user_avatar}')) {
        embed.setImage(config.verificationDmEmbedImage);
      }
    }

    // Handle footer
    if (config?.verificationDmEmbedFooter) {
      embed.setFooter({ text: config.verificationDmEmbedFooter });
    }

    return embed;
  }

  // Autorole embed with specific customization
  static autorole(title: string, description: string, config: GuildConfig): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.autoRoleEmbedColor as ColorResolvable) || '#aa55ff')
      .setTitle(config?.autoRoleEmbedTitle || `🎭 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail
    if (config?.autoRoleEmbedThumbnail && !config.autoRoleEmbedThumbnail.includes('{user_avatar}')) {
      embed.setThumbnail(config.autoRoleEmbedThumbnail);
    }

    // Handle image
    if (config?.autoRoleEmbedImage && !config.autoRoleEmbedImage.includes('{user_avatar}')) {
      embed.setImage(config.autoRoleEmbedImage);
    }

    // Handle footer
    if (config?.autoRoleEmbedFooter) {
      embed.setFooter({ text: config.autoRoleEmbedFooter });
    }

    return embed;
  }

  // Helper method to replace variables in strings
  static replaceVariables(text: string, member: GuildMember): string {
    return text
      .replace(/{user}/g, `<@${member.user.id}>`)
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)
      .replace(/{member_count}/g, member.guild.memberCount.toString())
      .replace(/{user_avatar}/g, member.user.displayAvatarURL({ size: 256 }));
  }
}