import { Events, MessageReaction, User } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export default {
  name: Events.MessageReactionRemove,
  async execute(reaction: MessageReaction, user: User) {
    const client = reaction.client as ExtendedClient;
    const autoRoleHandler = (client as any).autoRoleHandler;
    
    // Handle auto-roles removal
    await autoRoleHandler.handleReactionRemove(reaction, user);
  }
};