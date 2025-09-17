"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoRoleHandler = void 0;
class AutoRoleHandler {
    constructor(client) {
        this.client = client;
    }
    async handleReactionAdd(reaction, user) {
        if (user.bot)
            return;
        try {
            const config = await this.client.db.getGuildConfig(reaction.message.guildId);
            if (!config?.autoRoles?.length || config.autoRoleMessageId !== reaction.message.id) {
                return;
            }
            const autoRole = this.findAutoRole(config.autoRoles, reaction);
            if (!autoRole)
                return;
            const guild = reaction.message.guild;
            const member = guild.members.cache.get(user.id) ??
                await guild.members.fetch(user.id).catch(() => null);
            const role = guild.roles.cache.get(autoRole.roleId);
            if (!member || !role)
                return;
            if (!member.roles.cache.has(role.id)) {
                await member.roles.add(role);
                this.client.logger.info(`Rol agregado: ${role.name} a ${user.tag}`, {
                    guildId: guild.id,
                    userId: user.id,
                    roleId: role.id,
                    emoji: autoRole.emoji
                });
            }
        }
        catch (error) {
            this.client.logger.error('Error en autoroles (agregar)', { error });
        }
    }
    async handleReactionRemove(reaction, user) {
        if (user.bot)
            return;
        try {
            const config = await this.client.db.getGuildConfig(reaction.message.guildId);
            if (!config?.autoRoles?.length || config.autoRoleMessageId !== reaction.message.id) {
                return;
            }
            const autoRole = this.findAutoRole(config.autoRoles, reaction);
            if (!autoRole)
                return;
            const guild = reaction.message.guild;
            const member = guild.members.cache.get(user.id) ??
                await guild.members.fetch(user.id).catch(() => null);
            const role = guild.roles.cache.get(autoRole.roleId);
            if (!member || !role)
                return;
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                this.client.logger.info(`Rol removido: ${role.name} de ${user.tag}`, {
                    guildId: guild.id,
                    userId: user.id,
                    roleId: role.id,
                    emoji: autoRole.emoji
                });
            }
        }
        catch (error) {
            this.client.logger.error('Error en autoroles (remover)', { error });
        }
    }
    findAutoRole(autoRoles, reaction) {
        const reactionEmoji = reaction.emoji.toString();
        return autoRoles.find(ar => {
            if (reaction.emoji.id) {
                // Custom emoji
                return ar.emoji === reactionEmoji ||
                    ar.emoji === reaction.emoji.id ||
                    ar.emoji === `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
            }
            // Unicode emoji
            return ar.emoji === reactionEmoji || ar.emoji === reaction.emoji.name;
        });
    }
}
exports.AutoRoleHandler = AutoRoleHandler;
//# sourceMappingURL=autoroles.js.map