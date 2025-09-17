import { Client } from 'discord.js';
import { DatabaseManager } from '../database/connection';
import { Logger } from 'winston';

export interface ExtendedClient extends Client {
  db: DatabaseManager;
  logger: Logger;
}

export interface GuildConfig {
  guildId: string;
  verificationEnabled: boolean;
  verificationMethod: 'emoji' | 'keyword' | 'button';
  verificationChannelId?: string;
  verificationRoleId?: string;
  verificationMessage?: string;
  verificationKeyword?: string;
  verificationEmoji?: string;
  autoRoles: AutoRole[];
  autoRoleMessageId?: string;
  autoBanEnabled: boolean;
  autoBanDelayHours: number;
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