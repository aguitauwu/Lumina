import { Events, GuildMember } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export default {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    const client = member.client as ExtendedClient;
    const welcomeGoodbyeHandler = (client as any).welcomeGoodbyeHandler;
    
    await welcomeGoodbyeHandler.handleMemberLeave(member);
  }
};