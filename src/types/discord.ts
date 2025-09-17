import { Client } from 'discord.js';
import { DatabaseManager } from '../database/connection';
import { Logger } from 'winston';

export interface ExtendedClient extends Client {
  db: DatabaseManager;
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
  // Embed customization
  embedColor: string;
  embedThumbnail?: string;
  embedFooter?: string;
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