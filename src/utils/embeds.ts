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

  // Welcome embed with specific customization and fallbacks
  static welcome(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.welcomeEmbedColor || config?.embedColor || '#00ff00') as ColorResolvable)
      .setTitle(config?.welcomeEmbedTitle || `🎉 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail with fallback to general setting
    const thumbnailUrl = config?.welcomeEmbedThumbnail || config?.embedThumbnail;
    if (thumbnailUrl) {
      if (thumbnailUrl.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (thumbnailUrl.includes('{server_icon}') && member) {
        const serverIcon = member.guild.iconURL({ size: 256 });
        if (serverIcon) embed.setThumbnail(serverIcon);
      } else if (!thumbnailUrl.includes('{user_avatar}') && !thumbnailUrl.includes('{server_icon}')) {
        embed.setThumbnail(thumbnailUrl);
      }
    }

    // Handle image
    if (config?.welcomeEmbedImage) {
      if (config.welcomeEmbedImage.includes('{user_avatar}') && member) {
        embed.setImage(member.user.displayAvatarURL({ size: 512 }));
      } else if (config.welcomeEmbedImage.includes('{server_icon}') && member) {
        const serverIcon = member.guild.iconURL({ size: 512 });
        if (serverIcon) embed.setImage(serverIcon);
      } else if (!config.welcomeEmbedImage.includes('{user_avatar}') && !config.welcomeEmbedImage.includes('{server_icon}')) {
        embed.setImage(config.welcomeEmbedImage);
      }
    }

    // Handle footer with fallback to general setting
    const footerText = config?.welcomeEmbedFooter || config?.embedFooter;
    if (footerText) {
      embed.setFooter({ text: footerText });
    }

    return embed;
  }

  // Farewell embed with specific customization and fallbacks
  static farewell(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.goodbyeEmbedColor || config?.embedColor || '#ff4444') as ColorResolvable)
      .setTitle(config?.goodbyeEmbedTitle || `👋 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail with fallback to general setting
    const thumbnailUrl = config?.goodbyeEmbedThumbnail || config?.embedThumbnail;
    if (thumbnailUrl) {
      if (thumbnailUrl.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (thumbnailUrl.includes('{server_icon}') && member) {
        const serverIcon = member.guild.iconURL({ size: 256 });
        if (serverIcon) embed.setThumbnail(serverIcon);
      } else if (!thumbnailUrl.includes('{user_avatar}') && !thumbnailUrl.includes('{server_icon}')) {
        embed.setThumbnail(thumbnailUrl);
      }
    }

    // Handle image
    if (config?.goodbyeEmbedImage) {
      if (config.goodbyeEmbedImage.includes('{user_avatar}') && member) {
        embed.setImage(member.user.displayAvatarURL({ size: 512 }));
      } else if (config.goodbyeEmbedImage.includes('{server_icon}') && member) {
        const serverIcon = member.guild.iconURL({ size: 512 });
        if (serverIcon) embed.setImage(serverIcon);
      } else if (!config.goodbyeEmbedImage.includes('{user_avatar}') && !config.goodbyeEmbedImage.includes('{server_icon}')) {
        embed.setImage(config.goodbyeEmbedImage);
      }
    }

    // Handle footer with fallback to general setting
    const footerText = config?.goodbyeEmbedFooter || config?.embedFooter;
    if (footerText) {
      embed.setFooter({ text: footerText });
    }

    return embed;
  }

  // Verification embed with specific customization and fallbacks
  static verification(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.verificationEmbedColor || config?.embedColor || '#0099ff') as ColorResolvable)
      .setTitle(config?.verificationEmbedTitle || `🔐 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail with fallback to general setting
    const thumbnailUrl = config?.verificationEmbedThumbnail || config?.embedThumbnail;
    if (thumbnailUrl) {
      if (thumbnailUrl.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (!thumbnailUrl.includes('{user_avatar}')) {
        embed.setThumbnail(thumbnailUrl);
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

    // Handle footer with fallback to general setting
    const footerText = config?.verificationEmbedFooter || config?.embedFooter;
    if (footerText) {
      embed.setFooter({ text: footerText });
    }

    return embed;
  }

  // Verification DM embed with specific customization and fallbacks
  static verificationDM(title: string, description: string, config: GuildConfig, member?: GuildMember): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.verificationDmEmbedColor || config?.embedColor || '#00aaff') as ColorResolvable)
      .setTitle(`🔐 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail with fallback to general setting
    const thumbnailUrl = config?.verificationDmEmbedThumbnail || config?.embedThumbnail;
    if (thumbnailUrl) {
      if (thumbnailUrl.includes('{user_avatar}') && member) {
        embed.setThumbnail(member.user.displayAvatarURL({ size: 256 }));
      } else if (!thumbnailUrl.includes('{user_avatar}')) {
        embed.setThumbnail(thumbnailUrl);
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

    // Handle footer with fallback to general setting
    const footerText = config?.verificationDmEmbedFooter || config?.embedFooter;
    if (footerText) {
      embed.setFooter({ text: footerText });
    }

    return embed;
  }

  // Autorole embed with specific customization and fallbacks
  static autorole(title: string, description: string, config: GuildConfig): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor((config?.autoRoleEmbedColor || config?.embedColor || '#aa55ff') as ColorResolvable)
      .setTitle(config?.autoRoleEmbedTitle || `🎭 ${title}`)
      .setDescription(description)
      .setTimestamp();

    // Handle thumbnail with fallback to general setting
    const thumbnailUrl = config?.autoRoleEmbedThumbnail || config?.embedThumbnail;
    if (thumbnailUrl && !thumbnailUrl.includes('{user_avatar}')) {
      embed.setThumbnail(thumbnailUrl);
    }

    // Handle image
    if (config?.autoRoleEmbedImage && !config.autoRoleEmbedImage.includes('{user_avatar}')) {
      embed.setImage(config.autoRoleEmbedImage);
    }

    // Handle footer with fallback to general setting
    const footerText = config?.autoRoleEmbedFooter || config?.embedFooter;
    if (footerText) {
      embed.setFooter({ text: footerText });
    }

    return embed;
  }

  // Helper method to replace variables in strings
  static replaceVariables(text: string, member: GuildMember, options: { mention?: boolean } = {}): string {
    const mention = options.mention !== false; // Default to true unless explicitly false
    return text
      .replace(/{user}/g, mention ? `<@${member.user.id}>` : member.user.username)
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)
      .replace(/{member_count}/g, member.guild.memberCount.toString())
      .replace(/{user_avatar}/g, member.user.displayAvatarURL({ size: 256 }));
  }
}