import { Events, MessageReaction, User } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export default {
  name: Events.MessageReactionAdd,
  async execute(reaction: MessageReaction, user: User) {
    const client = reaction.client as ExtendedClient;
    const verificationHandler = (client as any).verificationHandler;
    const autoRoleHandler = (client as any).autoRoleHandler;
    
    // Handle verification
    await verificationHandler.handleEmojiVerification(reaction, user);
    
    // Handle auto-roles
    await autoRoleHandler.handleReactionAdd(reaction, user);
  }
};