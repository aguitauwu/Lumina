import { pgTable, text, boolean, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import type { AutoRole } from '../types/discord';

export const guildConfigs = pgTable('guild_configs', {
  guildId: text('guild_id').primaryKey(),
  // Verification system
  verificationEnabled: boolean('verification_enabled').default(false),
  verificationMethod: text('verification_method').$type<'emoji' | 'keyword' | 'button'>(),
  verificationChannelId: text('verification_channel_id'),
  verificationRoleId: text('verification_role_id'),
  verificationMessage: text('verification_message'),
  verificationKeyword: text('verification_keyword'),
  verificationEmoji: text('verification_emoji'),
  // Auto-roles system
  autoRoles: jsonb('auto_roles').$type<AutoRole[]>().default([]),
  autoRoleMessageId: text('auto_role_message_id'),
  // Auto-ban system
  autoBanEnabled: boolean('auto_ban_enabled').default(false),
  autoBanDelayHours: integer('auto_ban_delay_hours').default(24),
  // Welcome system
  welcomeEnabled: boolean('welcome_enabled').default(false),
  welcomeChannelId: text('welcome_channel_id'),
  welcomeMessage: text('welcome_message'),
  welcomeDmEnabled: boolean('welcome_dm_enabled').default(true),
  welcomeDmMessage: text('welcome_dm_message'),
  // Goodbye system
  goodbyeEnabled: boolean('goodbye_enabled').default(false),
  goodbyeChannelId: text('goodbye_channel_id'),
  goodbyeMessage: text('goodbye_message'),
  // Prefix system
  prefix: text('prefix').default('!'),
  // General embed customization
  embedColor: text('embed_color').default('#0099ff'),
  embedThumbnail: text('embed_thumbnail'),
  embedFooter: text('embed_footer'),
  // Welcome embed customization
  welcomeEmbedEnabled: boolean('welcome_embed_enabled').default(true),
  welcomeEmbedColor: text('welcome_embed_color').default('#00ff00'),
  welcomeEmbedThumbnail: text('welcome_embed_thumbnail'),
  welcomeEmbedFooter: text('welcome_embed_footer'),
  welcomeEmbedImage: text('welcome_embed_image'),
  welcomeEmbedTitle: text('welcome_embed_title'),
  // Farewell embed customization
  goodbyeEmbedEnabled: boolean('goodbye_embed_enabled').default(true),
  goodbyeEmbedColor: text('goodbye_embed_color').default('#ff4444'),
  goodbyeEmbedThumbnail: text('goodbye_embed_thumbnail'),
  goodbyeEmbedFooter: text('goodbye_embed_footer'),
  goodbyeEmbedImage: text('goodbye_embed_image'),
  goodbyeEmbedTitle: text('goodbye_embed_title'),
  // Verification embed customization
  verificationEmbedEnabled: boolean('verification_embed_enabled').default(true),
  verificationEmbedColor: text('verification_embed_color').default('#0099ff'),
  verificationEmbedThumbnail: text('verification_embed_thumbnail'),
  verificationEmbedFooter: text('verification_embed_footer'),
  verificationEmbedImage: text('verification_embed_image'),
  verificationEmbedTitle: text('verification_embed_title'),
  verificationDmMessage: text('verification_dm_message'),
  verificationDmEmbedEnabled: boolean('verification_dm_embed_enabled').default(true),
  verificationDmEmbedColor: text('verification_dm_embed_color').default('#00aaff'),
  verificationDmEmbedThumbnail: text('verification_dm_embed_thumbnail'),
  verificationDmEmbedFooter: text('verification_dm_embed_footer'),
  verificationDmEmbedImage: text('verification_dm_embed_image'),
  // Autorole embed customization
  autoRoleEmbedEnabled: boolean('auto_role_embed_enabled').default(true),
  autoRoleEmbedColor: text('auto_role_embed_color').default('#aa55ff'),
  autoRoleEmbedThumbnail: text('auto_role_embed_thumbnail'),
  autoRoleEmbedFooter: text('auto_role_embed_footer'),
  autoRoleEmbedImage: text('auto_role_embed_image'),
  autoRoleEmbedTitle: text('auto_role_embed_title'),
  // Timestamps
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