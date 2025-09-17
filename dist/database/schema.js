"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userJoinLogs = exports.verificationLogs = exports.guildConfigs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.guildConfigs = (0, pg_core_1.pgTable)('guild_configs', {
    guildId: (0, pg_core_1.text)('guild_id').primaryKey(),
    verificationEnabled: (0, pg_core_1.boolean)('verification_enabled').default(false),
    verificationMethod: (0, pg_core_1.text)('verification_method').$type(),
    verificationChannelId: (0, pg_core_1.text)('verification_channel_id'),
    verificationRoleId: (0, pg_core_1.text)('verification_role_id'),
    verificationMessage: (0, pg_core_1.text)('verification_message'),
    verificationKeyword: (0, pg_core_1.text)('verification_keyword'),
    verificationEmoji: (0, pg_core_1.text)('verification_emoji'),
    autoRoles: (0, pg_core_1.jsonb)('auto_roles').$type().default([]),
    autoRoleMessageId: (0, pg_core_1.text)('auto_role_message_id'),
    autoBanEnabled: (0, pg_core_1.boolean)('auto_ban_enabled').default(false),
    autoBanDelayHours: (0, pg_core_1.integer)('auto_ban_delay_hours').default(24),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.verificationLogs = (0, pg_core_1.pgTable)('verification_logs', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    guildId: (0, pg_core_1.text)('guild_id').notNull(),
    userId: (0, pg_core_1.text)('user_id').notNull(),
    action: (0, pg_core_1.text)('action').$type().notNull(),
    method: (0, pg_core_1.text)('method').$type(),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow()
});
exports.userJoinLogs = (0, pg_core_1.pgTable)('user_join_logs', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    guildId: (0, pg_core_1.text)('guild_id').notNull(),
    userId: (0, pg_core_1.text)('user_id').notNull(),
    joinedAt: (0, pg_core_1.timestamp)('joined_at').defaultNow(),
    verified: (0, pg_core_1.boolean)('verified').default(false),
    verifiedAt: (0, pg_core_1.timestamp)('verified_at'),
    banScheduledAt: (0, pg_core_1.timestamp)('ban_scheduled_at')
});
//# sourceMappingURL=schema.js.map