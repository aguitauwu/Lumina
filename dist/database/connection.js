"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const drizzle_orm_1 = require("drizzle-orm");
const schema = __importStar(require("./schema"));
class DatabaseManager {
    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
        }
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
        this.db = (0, node_postgres_1.drizzle)(this.pool, { schema });
    }
    async init() {
        try {
            // Test connection
            await this.pool.query('SELECT 1');
            console.log('✅ Database connected successfully');
        }
        catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }
    async getGuildConfig(guildId) {
        try {
            const [config] = await this.db
                .select()
                .from(schema.guildConfigs)
                .where((0, drizzle_orm_1.eq)(schema.guildConfigs.guildId, guildId));
            return config || null;
        }
        catch (error) {
            console.error('Error getting guild config:', error);
            return null;
        }
    }
    async updateGuildConfig(guildId, updates) {
        try {
            await this.db
                .insert(schema.guildConfigs)
                .values({ guildId, ...updates })
                .onConflictDoUpdate({
                target: schema.guildConfigs.guildId,
                set: { ...updates, updatedAt: new Date() }
            });
        }
        catch (error) {
            console.error('Error updating guild config:', error);
            throw error;
        }
    }
    async logVerification(log) {
        try {
            await this.db.insert(schema.verificationLogs).values({
                ...log,
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('Error logging verification:', error);
        }
    }
    async logUserJoin(guildId, userId) {
        try {
            await this.db.insert(schema.userJoinLogs).values({
                id: `${guildId}-${userId}-${Date.now()}`,
                guildId,
                userId,
                joinedAt: new Date()
            });
        }
        catch (error) {
            console.error('Error logging user join:', error);
        }
    }
    async close() {
        await this.pool.end();
    }
}
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=connection.js.map