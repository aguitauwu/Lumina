import { Events, Message } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot || !message.guild) return;
    
    const client = message.client as ExtendedClient;
    const verificationHandler = (client as any).verificationHandler;
    const prefixCommandHandler = (client as any).prefixCommandHandler;
    
    // Handle keyword verification
    await verificationHandler.handleKeywordVerification(message);
    
    // Handle prefix commands
    await prefixCommandHandler.handleMessage(message);
  }
};