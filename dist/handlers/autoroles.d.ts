import { MessageReaction, User } from 'discord.js';
import { ExtendedClient } from '../types/discord';
export declare class AutoRoleHandler {
    private client;
    constructor(client: ExtendedClient);
    handleReactionAdd(reaction: MessageReaction, user: User): Promise<void>;
    handleReactionRemove(reaction: MessageReaction, user: User): Promise<void>;
    private findAutoRole;
}
//# sourceMappingURL=autoroles.d.ts.map