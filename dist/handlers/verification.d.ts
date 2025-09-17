import { GuildMember, Message, MessageReaction, User, ButtonInteraction } from 'discord.js';
import { ExtendedClient } from '../types/discord';
export declare class VerificationHandler {
    private client;
    constructor(client: ExtendedClient);
    handleMemberJoin(member: GuildMember): Promise<void>;
    handleEmojiVerification(reaction: MessageReaction, user: User): Promise<void>;
    handleKeywordVerification(message: Message): Promise<void>;
    handleButtonVerification(interaction: ButtonInteraction): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
}
//# sourceMappingURL=verification.d.ts.map