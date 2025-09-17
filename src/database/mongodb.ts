import mongoose from 'mongoose';
import type { GuildConfig, VerificationLog } from '../types/discord';

// MongoDB Schemas
const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  
  // Verification system
  verificationEnabled: { type: Boolean, default: false },
  verificationMethod: { type: String, enum: ['emoji', 'keyword', 'button'], default: 'emoji' },
  verificationChannelId: { type: String, default: null },
  verificationRoleId: { type: String, default: null },
  verificationMessage: { type: String, default: null },
  verificationKeyword: { type: String, default: null },
  verificationEmoji: { type: String, default: null },
  
  // Auto-roles system
  autoRoles: [{
    emoji: String,
    roleId: String,
    roleName: String,
    description: String
  }],
  autoRoleMessageId: { type: String, default: null },
  
  // Auto-ban system
  autoBanEnabled: { type: Boolean, default: false },
  autoBanDelayHours: { type: Number, default: 24 },
  
  // Welcome system
  welcomeEnabled: { type: Boolean, default: false },
  welcomeChannelId: { type: String, default: null },
  welcomeMessage: { type: String, default: null },
  welcomeDmEnabled: { type: Boolean, default: false },
  welcomeDmMessage: { type: String, default: null },
  
  // Goodbye system
  goodbyeEnabled: { type: Boolean, default: false },
  goodbyeChannelId: { type: String, default: null },
  goodbyeMessage: { type: String, default: null },
  
  // Prefix system
  prefix: { type: String, default: '!' },
  
  // General embed customization
  embedColor: { type: String, default: '#7289DA' },
  embedThumbnail: { type: String, default: null },
  embedFooter: { type: String, default: null },
  
  // Welcome embed customization
  welcomeEmbedEnabled: { type: Boolean, default: false },
  welcomeEmbedColor: { type: String, default: '#00FF00' },
  welcomeEmbedThumbnail: { type: String, default: null },
  welcomeEmbedFooter: { type: String, default: null },
  welcomeEmbedImage: { type: String, default: null },
  welcomeEmbedTitle: { type: String, default: null },
  
  // Farewell embed customization
  goodbyeEmbedEnabled: { type: Boolean, default: false },
  goodbyeEmbedColor: { type: String, default: '#FF0000' },
  goodbyeEmbedThumbnail: { type: String, default: null },
  goodbyeEmbedFooter: { type: String, default: null },
  goodbyeEmbedImage: { type: String, default: null },
  goodbyeEmbedTitle: { type: String, default: null },
  
  // Verification embed customization
  verificationEmbedEnabled: { type: Boolean, default: false },
  verificationEmbedColor: { type: String, default: '#FFFF00' },
  verificationEmbedThumbnail: { type: String, default: null },
  verificationEmbedFooter: { type: String, default: null },
  verificationEmbedImage: { type: String, default: null },
  verificationEmbedTitle: { type: String, default: null },
  verificationDmMessage: { type: String, default: null },
  verificationDmEmbedEnabled: { type: Boolean, default: false },
  verificationDmEmbedColor: { type: String, default: '#FFFF00' },
  verificationDmEmbedThumbnail: { type: String, default: null },
  verificationDmEmbedFooter: { type: String, default: null },
  verificationDmEmbedImage: { type: String, default: null },
  
  // Autorole embed customization
  autoRoleEmbedEnabled: { type: Boolean, default: false },
  autoRoleEmbedColor: { type: String, default: '#00FFFF' },
  autoRoleEmbedThumbnail: { type: String, default: null },
  autoRoleEmbedFooter: { type: String, default: null },
  autoRoleEmbedImage: { type: String, default: null },
  autoRoleEmbedTitle: { type: String, default: null },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const verificationLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  action: { type: String, required: true },
  success: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

const userJoinLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }
});

// Models
const GuildConfigModel = mongoose.model('GuildConfig', guildConfigSchema);
const VerificationLogModel = mongoose.model('VerificationLog', verificationLogSchema);
const UserJoinLogModel = mongoose.model('UserJoinLog', userJoinLogSchema);

export class MongoDBManager {
  private connected = false;

  async init() {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not provided');
      }

      await mongoose.connect(process.env.MONGODB_URI);
      this.connected = true;
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
    try {
      if (!this.connected) await this.init();
      
      const config = await GuildConfigModel.findOne({ guildId });
      return config?.toObject() as GuildConfig || null;
    } catch (error) {
      console.error('Error getting guild config from MongoDB:', error);
      return null;
    }
  }

  async updateGuildConfig(guildId: string, updates: Partial<GuildConfig>): Promise<void> {
    try {
      if (!this.connected) await this.init();
      
      await GuildConfigModel.findOneAndUpdate(
        { guildId },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        },
        { 
          upsert: true, 
          new: true 
        }
      );
    } catch (error) {
      console.error('Error updating guild config in MongoDB:', error);
      throw error;
    }
  }

  async logVerification(log: Omit<VerificationLog, 'timestamp'>): Promise<void> {
    try {
      if (!this.connected) await this.init();
      
      await VerificationLogModel.create({
        ...log,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging verification in MongoDB:', error);
    }
  }

  async logUserJoin(guildId: string, userId: string): Promise<void> {
    try {
      if (!this.connected) await this.init();
      
      await UserJoinLogModel.create({
        guildId,
        userId,
        joinedAt: new Date()
      });
    } catch (error) {
      console.error('Error logging user join in MongoDB:', error);
    }
  }

  async close(): Promise<void> {
    if (this.connected) {
      await mongoose.disconnect();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}