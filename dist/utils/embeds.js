"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedUtils = void 0;
const discord_js_1 = require("discord.js");
class EmbedUtils {
    static success(title, description) {
        return new discord_js_1.EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(`✅ ${title}`)
            .setDescription(description || '')
            .setTimestamp();
    }
    static error(title, description) {
        return new discord_js_1.EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(`❌ ${title}`)
            .setDescription(description || '')
            .setTimestamp();
    }
    static info(title, description) {
        return new discord_js_1.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`ℹ️ ${title}`)
            .setDescription(description || '')
            .setTimestamp();
    }
    static warning(title, description) {
        return new discord_js_1.EmbedBuilder()
            .setColor('#ff9900')
            .setTitle(`⚠️ ${title}`)
            .setDescription(description || '')
            .setTimestamp();
    }
}
exports.EmbedUtils = EmbedUtils;
//# sourceMappingURL=embeds.js.map