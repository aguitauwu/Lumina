import { pgTable, text, boolean, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import type { AutoRole } from '../types/discord';

export const guildConfigs = pgTable('guild_configs', {
  guildId: text('guild_id').primaryKey(),
  verificationEnabled: boolean('verification_enabled').default(false),
  verificationMethod: text('verification_method').$type<'emoji' | 'keyword' | 'button'>(),
  verificationChannelId: text('verification_channel_id'),
  verificationRoleId: text('verification_role_id'),
  verificationMessage: text('verification_message'),
  verificationKeyword: text('verification_keyword'),
  verificationEmoji: text('verification_emoji'),
  autoRoles: jsonb('auto_roles').$type<AutoRole[]>().default([]),
  autoRoleMessageId: text('auto_role_message_id'),
  autoBanEnabled: boolean('auto_ban_enabled').default(false),
  autoBanDelayHours: integer('auto_ban_delay_hours').default(24),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const verificationLogs = pgTable('verification_logs', {
  id: text('id').primaryKey(),
  guildId: text('guild_id').notNull(),
  userId: text('user_id').notNull(),
  action: text('action').$type<'verified' | 'banned' | 'kicked'>().notNull(),
  method: text('method').$type<'emoji' | 'keyword' | 'button'>(),
  timestamp: timestamp('timestamp').defaultNow()
});

export const userJoinLogs = pgTable('user_join_logs', {
  id: text('id').primaryKey(),
  guildId: text('guild_id').notNull(),
  userId: text('user_id').notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
  verified: boolean('verified').default(false),
  verifiedAt: timestamp('verified_at'),
  banScheduledAt: timestamp('ban_scheduled_at')
});