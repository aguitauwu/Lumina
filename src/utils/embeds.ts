import { EmbedBuilder, ColorResolvable } from 'discord.js';
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
}