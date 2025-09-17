import type { GuildConfig, VerificationLog } from '../types/discord';
export declare class DatabaseManager {
    private db;
    private pool;
    constructor();
    init(): Promise<void>;
    getGuildConfig(guildId: string): Promise<GuildConfig | null>;
    updateGuildConfig(guildId: string, updates: Partial<GuildConfig>): Promise<void>;
    logVerification(log: Omit<VerificationLog, 'timestamp'>): Promise<void>;
    logUserJoin(guildId: string, userId: string): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=connection.d.ts.map