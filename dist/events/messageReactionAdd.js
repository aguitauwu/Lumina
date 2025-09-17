"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.MessageReactionAdd,
    async execute(reaction, user) {
        const client = reaction.client;
        const verificationHandler = client.verificationHandler;
        const autoRoleHandler = client.autoRoleHandler;
        // Handle verification
        await verificationHandler.handleEmojiVerification(reaction, user);
        // Handle auto-roles
        await autoRoleHandler.handleReactionAdd(reaction, user);
    }
};
//# sourceMappingURL=messageReactionAdd.js.map