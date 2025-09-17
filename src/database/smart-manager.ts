import { DatabaseManager } from './connection';
import { MongoDBManager } from './mongodb';
import { LocalStorageManager } from './local-storage';
import type { GuildConfig, VerificationLog } from '../types/discord';

export type DatabaseType = 'postgresql' | 'mongodb' | 'local';

export interface IDatabaseManager {
  init(): Promise<void>;
  getGuildConfig(guildId: string): Promise<GuildConfig | null>;
  updateGuildConfig(guildId: string, updates: Partial<GuildConfig>): Promise<void>;
  logVerification(log: Omit<VerificationLog, 'timestamp'>): Promise<void>;
  logUserJoin(guildId: string, userId: string): Promise<void>;
  close(): Promise<void>;
}

export class SmartDatabaseManager implements IDatabaseManager {
  private activeManager: IDatabaseManager | null = null;
  private databaseType: DatabaseType | null = null;

  constructor() {}

  async init(): Promise<void> {
    console.log('🔍 Detectando sistemas de base de datos disponibles...');

    // Priority order: PostgreSQL > MongoDB > Local Storage
    const managers: Array<{ type: DatabaseType; manager: IDatabaseManager; envVar?: string }> = [
      {
        type: 'postgresql',
        manager: new DatabaseManager(),
        envVar: 'DATABASE_URL'
      },
      {
        type: 'mongodb',
        manager: new MongoDBManager(),
        envVar: 'MONGODB_URI'
      },
      {
        type: 'local',
        manager: new LocalStorageManager()
      }
    ];

    for (const { type, manager, envVar } of managers) {
      try {
        // Check if environment variable is available (if required)
        if (envVar && !process.env[envVar]) {
          console.log(`⏭️  ${type.toUpperCase()}: Variable de entorno ${envVar} no encontrada`);
          continue;
        }

        console.log(`🔄 Probando conexión con ${type.toUpperCase()}...`);
        
        await manager.init();
        
        this.activeManager = manager;
        this.databaseType = type;
        
        console.log(`✅ Sistema de base de datos activo: ${type.toUpperCase()}`);
        break;
        
      } catch (error) {
        console.log(`❌ ${type.toUpperCase()} no disponible:`, error instanceof Error ? error.message : 'Error desconocido');
        
        // Try to close the failed manager
        try {
          await manager.close();
        } catch (closeError) {
          // Ignore close errors for failed managers
        }
      }
    }

    if (!this.activeManager) {
      throw new Error('❌ No se pudo inicializar ningún sistema de base de datos');
    }
  }

  async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
    if (!this.activeManager) {
      throw new Error('Database manager not initialized');
    }
    return this.activeManager.getGuildConfig(guildId);
  }

  async updateGuildConfig(guildId: string, updates: Partial<GuildConfig>): Promise<void> {
    if (!this.activeManager) {
      throw new Error('Database manager not initialized');
    }
    return this.activeManager.updateGuildConfig(guildId, updates);
  }

  async logVerification(log: Omit<VerificationLog, 'timestamp'>): Promise<void> {
    if (!this.activeManager) {
      throw new Error('Database manager not initialized');
    }
    return this.activeManager.logVerification(log);
  }

  async logUserJoin(guildId: string, userId: string): Promise<void> {
    if (!this.activeManager) {
      throw new Error('Database manager not initialized');
    }
    return this.activeManager.logUserJoin(guildId, userId);
  }

  async close(): Promise<void> {
    if (this.activeManager) {
      await this.activeManager.close();
      this.activeManager = null;
      this.databaseType = null;
    }
  }

  // Utility methods
  getDatabaseType(): DatabaseType | null {
    return this.databaseType;
  }

  isActive(): boolean {
    return this.activeManager !== null;
  }

  // Migration utilities
  async migrateData(targetType: DatabaseType): Promise<void> {
    if (!this.activeManager || this.databaseType === targetType) {
      console.log('❌ No hay datos para migrar o ya estás usando el tipo de base de datos de destino');
      return;
    }

    console.log(`🔄 Iniciando migración de ${this.databaseType} a ${targetType}...`);

    // This is a complex operation that would require reading all data
    // from current manager and writing to new manager
    // Implementation would depend on specific migration requirements
    console.log('⚠️  Funcionalidad de migración no implementada aún');
  }

  // Health check
  async healthCheck(): Promise<{
    type: DatabaseType | null;
    status: 'healthy' | 'degraded' | 'failed';
    details: string;
  }> {
    if (!this.activeManager || !this.databaseType) {
      return {
        type: null,
        status: 'failed',
        details: 'No database manager active'
      };
    }

    try {
      // Try a simple read operation
      await this.getGuildConfig('health-check-test');
      
      return {
        type: this.databaseType,
        status: 'healthy',
        details: `${this.databaseType.toUpperCase()} connection is working properly`
      };
    } catch (error) {
      return {
        type: this.databaseType,
        status: 'degraded',
        details: `${this.databaseType.toUpperCase()} connection has issues: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Backup functionality (for compatible databases)
  async createBackup(): Promise<string | null> {
    if (this.databaseType === 'local' && this.activeManager instanceof LocalStorageManager) {
      return (this.activeManager as LocalStorageManager).createBackup();
    }
    
    console.log(`⚠️  Backup no soportado para ${this.databaseType}`);
    return null;
  }
}