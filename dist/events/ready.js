"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        client.logger.info(`✅ Bot conectado como ${client.user?.tag}`);
        client.logger.info(`🌟 Activo en ${client.guilds.cache.size} servidor(es)`);
        // Set bot status
        client.user?.setActivity('Verificando usuarios', { type: 3 });
    }
};
//# sourceMappingURL=ready.js.map