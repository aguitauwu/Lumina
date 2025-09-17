"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    async execute(member) {
        const client = member.client;
        const verificationHandler = client.verificationHandler;
        await verificationHandler.handleMemberJoin(member);
    }
};
//# sourceMappingURL=guildMemberAdd.js.map