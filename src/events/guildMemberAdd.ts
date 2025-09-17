import { Events, GuildMember } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    const client = member.client as ExtendedClient;
    const verificationHandler = (client as any).verificationHandler;
    
    await verificationHandler.handleMemberJoin(member);
  }
};