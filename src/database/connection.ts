import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import type { GuildConfig, VerificationLog } from '../types/discord';

export class DatabaseManager {
  private db;
  private pool: Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
    }

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool, { schema });
  }

  async init() {
    try {
      // Test connection
      await this.pool.query('SELECT 1');
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
    try {
      const [config] = await this.db
        .select()
        .from(schema.guildConfigs)
        .where(eq(schema.guildConfigs.guildId, guildId));

      return config as GuildConfig || null;
    } catch (error) {
      console.error('Error getting guild config:', error);
      return null;
    }
  }

  async updateGuildConfig(guildId: string, updates: Partial<GuildConfig>): Promise<void> {
    try {
      await this.db
        .insert(schema.guildConfigs)
        .values({ guildId, ...updates })
        .onConflictDoUpdate({
          target: schema.guildConfigs.guildId,
          set: { ...updates, updatedAt: new Date() }
        });
    } catch (error) {
      console.error('Error updating guild config:', error);
      throw error;
    }
  }

  async logVerification(log: Omit<VerificationLog, 'timestamp'>): Promise<void> {
    try {
      await this.db.insert(schema.verificationLogs).values({
        ...log,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging verification:', error);
    }
  }

  async logUserJoin(guildId: string, userId: string): Promise<void> {
    try {
      await this.db.insert(schema.userJoinLogs).values({
        id: `${guildId}-${userId}-${Date.now()}`,
        guildId,
        userId,
        joinedAt: new Date()
      });
    } catch (error) {
      console.error('Error logging user join:', error);
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}