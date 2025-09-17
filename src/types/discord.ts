import { Client } from 'discord.js';
import { SmartDatabaseManager } from '../database/smart-manager';
import { Logger } from 'winston';

export interface ExtendedClient extends Client {
  db: SmartDatabaseManager;
  logger: Logger;
}

export interface GuildConfig {
  guildId: string;
  // Verification system
  verificationEnabled: boolean;
  verificationMethod: 'emoji' | 'keyword' | 'button';
  verificationChannelId?: string;
  verificationRoleId?: string;
  verificationMessage?: string;
  verificationKeyword?: string;
  verificationEmoji?: string;
  // Auto-roles system
  autoRoles: AutoRole[];
  autoRoleMessageId?: string;
  // Auto-ban system
  autoBanEnabled: boolean;
  autoBanDelayHours: number;
  // Welcome system
  welcomeEnabled: boolean;
  welcomeChannelId?: string;
  welcomeMessage?: string;
  welcomeDmEnabled: boolean;
  welcomeDmMessage?: string;
  // Goodbye system
  goodbyeEnabled: boolean;
  goodbyeChannelId?: string;
  goodbyeMessage?: string;
  // Prefix system
  prefix: string;
  // General embed customization
  embedColor: string;
  embedThumbnail?: string;
  embedFooter?: string;
  // Welcome embed customization
  welcomeEmbedEnabled?: boolean;
  welcomeEmbedColor?: string;
  welcomeEmbedThumbnail?: string;
  welcomeEmbedFooter?: string;
  welcomeEmbedImage?: string;
  welcomeEmbedTitle?: string;
  // Farewell embed customization
  goodbyeEmbedEnabled?: boolean;
  goodbyeEmbedColor?: string;
  goodbyeEmbedThumbnail?: string;
  goodbyeEmbedFooter?: string;
  goodbyeEmbedImage?: string;
  goodbyeEmbedTitle?: string;
  // Verification embed customization
  verificationEmbedEnabled?: boolean;
  verificationEmbedColor?: string;
  verificationEmbedThumbnail?: string;
  verificationEmbedFooter?: string;
  verificationEmbedImage?: string;
  verificationEmbedTitle?: string;
  verificationDmMessage?: string;
  verificationDmEmbedEnabled?: boolean;
  verificationDmEmbedColor?: string;
  verificationDmEmbedThumbnail?: string;
  verificationDmEmbedFooter?: string;
  verificationDmEmbedImage?: string;
  // Autorole embed customization
  autoRoleEmbedEnabled?: boolean;
  autoRoleEmbedColor?: string;
  autoRoleEmbedThumbnail?: string;
  autoRoleEmbedFooter?: string;
  autoRoleEmbedImage?: string;
  autoRoleEmbedTitle?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface AutoRole {
  emoji: string;
  roleId: string;
  roleName: string;
  description?: string;
}

export interface VerificationLog {
  id: string;
  guildId: string;
  userId: string;
  action: 'verified' | 'banned' | 'kicked';
  method?: 'emoji' | 'keyword' | 'button';
  timestamp: Date;
}