"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild)
            return;
        const client = message.client;
        const verificationHandler = client.verificationHandler;
        // Handle keyword verification
        await verificationHandler.handleKeywordVerification(message);
    }
};
//# sourceMappingURL=messageCreate.js.map