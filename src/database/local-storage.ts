import * as fs from 'fs';
import * as path from 'path';
import type { GuildConfig, VerificationLog } from '../types/discord';

interface LocalData {
  guildConfigs: Record<string, GuildConfig>;
  verificationLogs: VerificationLog[];
  userJoinLogs: Array<{
    guildId: string;
    userId: string;
    joinedAt: string;
  }>;
}

export class LocalStorageManager {
  private dataPath: string;
  private data: LocalData;

  constructor(dataPath = './data') {
    this.dataPath = dataPath;
    this.data = {
      guildConfigs: {},
      verificationLogs: [],
      userJoinLogs: []
    };
  }

  async init() {
    try {
      // Create data directory if it doesn't exist
      if (!fs.existsSync(this.dataPath)) {
        fs.mkdirSync(this.dataPath, { recursive: true });
      }

      const configPath = path.join(this.dataPath, 'lumina-data.json');
      
      // Load existing data or create new file
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        await this.saveData();
      }

      console.log('✅ Local storage initialized successfully');
    } catch (error) {
      console.error('❌ Local storage initialization failed:', error);
      throw error;
    }
  }

  private async saveData(): Promise<void> {
    try {
      const configPath = path.join(this.dataPath, 'lumina-data.json');
      fs.writeFileSync(configPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
      throw error;
    }
  }

  async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
    try {
      return this.data.guildConfigs[guildId] || null;
    } catch (error) {
      console.error('Error getting guild config from local storage:', error);
      return null;
    }
  }

  async updateGuildConfig(guildId: string, updates: Partial<GuildConfig>): Promise<void> {
    try {
      const existing = this.data.guildConfigs[guildId] || {};
      
      this.data.guildConfigs[guildId] = {
        ...existing,
        ...updates,
        guildId,
        updatedAt: new Date()
      } as GuildConfig;

      await this.saveData();
    } catch (error) {
      console.error('Error updating guild config in local storage:', error);
      throw error;
    }
  }

  async logVerification(log: Omit<VerificationLog, 'timestamp'>): Promise<void> {
    try {
      this.data.verificationLogs.push({
        ...log,
        timestamp: new Date()
      } as VerificationLog);

      // Keep only last 1000 logs to prevent excessive file growth
      if (this.data.verificationLogs.length > 1000) {
        this.data.verificationLogs = this.data.verificationLogs.slice(-1000);
      }

      await this.saveData();
    } catch (error) {
      console.error('Error logging verification in local storage:', error);
    }
  }

  async logUserJoin(guildId: string, userId: string): Promise<void> {
    try {
      this.data.userJoinLogs.push({
        guildId,
        userId,
        joinedAt: new Date().toISOString()
      });

      // Keep only last 1000 logs to prevent excessive file growth
      if (this.data.userJoinLogs.length > 1000) {
        this.data.userJoinLogs = this.data.userJoinLogs.slice(-1000);
      }

      await this.saveData();
    } catch (error) {
      console.error('Error logging user join in local storage:', error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.saveData();
    } catch (error) {
      console.error('Error closing local storage:', error);
    }
  }

  // Backup functionality
  async createBackup(backupPath?: string): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `lumina-backup-${timestamp}.json`;
      const finalBackupPath = backupPath 
        ? path.join(backupPath, backupFileName)
        : path.join(this.dataPath, 'backups', backupFileName);

      // Create backup directory if it doesn't exist
      const backupDir = path.dirname(finalBackupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      fs.writeFileSync(finalBackupPath, JSON.stringify(this.data, null, 2));
      console.log(`✅ Backup created: ${finalBackupPath}`);
      return finalBackupPath;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  async restoreBackup(backupPath: string): Promise<void> {
    try {
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file not found: ${backupPath}`);
      }

      const backupContent = fs.readFileSync(backupPath, 'utf8');
      this.data = JSON.parse(backupContent);
      
      await this.saveData();
      console.log(`✅ Backup restored from: ${backupPath}`);
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }
}