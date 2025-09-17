"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.MessageReactionRemove,
    async execute(reaction, user) {
        const client = reaction.client;
        const autoRoleHandler = client.autoRoleHandler;
        // Handle auto-roles removal
        await autoRoleHandler.handleReactionRemove(reaction, user);
    }
};
//# sourceMappingURL=messageReactionRemove.js.map