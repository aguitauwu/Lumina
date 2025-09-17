import type { AutoRole } from '../types/discord';
export declare const guildConfigs: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "guild_configs";
    schema: undefined;
    columns: {
        guildId: import("drizzle-orm/pg-core").PgColumn<{
            name: "guild_id";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        verificationEnabled: import("drizzle-orm/pg-core").PgColumn<{
            name: "verification_enabled";
            tableName: "guild_configs";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        verificationMethod: import("drizzle-orm/pg-core").PgColumn<{
            name: "verification_method";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: "emoji" | "keyword" | "button";
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        verificationChannelId: import("drizzle-orm/pg-core").PgColumn<{
            name: "verification_channel_id";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        verificationRoleId: import("drizzle-orm/pg-core").PgColumn<{
            name: "verification_role_id";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        verificationMessage: import("drizzle-orm/pg-core").PgColumn<{
            name: "verification_message";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        verificationKeyword: import("drizzle-orm/pg-core").PgColumn<{
            name: "verification_keyword";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        verificationEmoji: import("drizzle-orm/pg-core").PgColumn<{
            name: "verification_emoji";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        autoRoles: import("drizzle-orm/pg-core").PgColumn<{
            name: "auto_roles";
            tableName: "guild_configs";
            dataType: "json";
            columnType: "PgJsonb";
            data: AutoRole[];
            driverParam: unknown;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        autoRoleMessageId: import("drizzle-orm/pg-core").PgColumn<{
            name: "auto_role_message_id";
            tableName: "guild_configs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        autoBanEnabled: import("drizzle-orm/pg-core").PgColumn<{
            name: "auto_ban_enabled";
            tableName: "guild_configs";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        autoBanDelayHours: import("drizzle-orm/pg-core").PgColumn<{
            name: "auto_ban_delay_hours";
            tableName: "guild_configs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "guild_configs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "guild_configs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const verificationLogs: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "verification_logs";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "verification_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        guildId: import("drizzle-orm/pg-core").PgColumn<{
            name: "guild_id";
            tableName: "verification_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "verification_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        action: import("drizzle-orm/pg-core").PgColumn<{
            name: "action";
            tableName: "verification_logs";
            dataType: "string";
            columnType: "PgText";
            data: "verified" | "banned" | "kicked";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        method: import("drizzle-orm/pg-core").PgColumn<{
            name: "method";
            tableName: "verification_logs";
            dataType: "string";
            columnType: "PgText";
            data: "emoji" | "keyword" | "button";
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        timestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "timestamp";
            tableName: "verification_logs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const userJoinLogs: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "user_join_logs";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "user_join_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        guildId: import("drizzle-orm/pg-core").PgColumn<{
            name: "guild_id";
            tableName: "user_join_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "user_join_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        joinedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "joined_at";
            tableName: "user_join_logs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        verified: import("drizzle-orm/pg-core").PgColumn<{
            name: "verified";
            tableName: "user_join_logs";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        verifiedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "verified_at";
            tableName: "user_join_logs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        banScheduledAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "ban_scheduled_at";
            tableName: "user_join_logs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
//# sourceMappingURL=schema.d.ts.map