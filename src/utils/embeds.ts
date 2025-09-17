import { EmbedBuilder, ColorResolvable } from 'discord.js';

export class EmbedUtils {
  static success(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#00ff00' as ColorResolvable)
      .setTitle(`✅ ${title}`)
      .setDescription(description || '')
      .setTimestamp();
  }

  static error(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#ff0000' as ColorResolvable)
      .setTitle(`❌ ${title}`)
      .setDescription(description || '')
      .setTimestamp();
  }

  static info(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#0099ff' as ColorResolvable)
      .setTitle(`ℹ️ ${title}`)
      .setDescription(description || '')
      .setTimestamp();
  }

  static warning(title: string, description?: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#ff9900' as ColorResolvable)
      .setTitle(`⚠️ ${title}`)
      .setDescription(description || '')
      .setTimestamp();
  }
}