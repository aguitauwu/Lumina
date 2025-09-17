"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationHandler = void 0;
const embeds_1 = require("../utils/embeds");
class VerificationHandler {
    constructor(client) {
        this.client = client;
    }
    async handleMemberJoin(member) {
        if (member.user.bot)
            return;
        try {
            const config = await this.client.db.getGuildConfig(member.guild.id);
            if (!config?.verificationEnabled)
                return;
            // Log user join
            await this.client.db.logUserJoin(member.guild.id, member.user.id);
            // Send welcome DM with verification instructions
            const embed = embeds_1.EmbedUtils.info(`¡Bienvenido a ${member.guild.name}!`, `Para acceder al servidor, debes verificarte en el canal de verificación.\n\n` +
                `**Método de verificación:** ${config.verificationMethod}`);
            try {
                await member.send({ embeds: [embed] });
            }
            catch (error) {
                this.client.logger.warn(`No se pudo enviar DM a ${member.user.tag}`, { error });
            }
            this.client.logger.info(`Nuevo usuario: ${member.user.tag} en ${member.guild.name}`, {
                guildId: member.guild.id,
                userId: member.user.id
            });
        }
        catch (error) {
            this.client.logger.error('Error manejando nuevo miembro', { error });
        }
    }
    async handleEmojiVerification(reaction, user) {
        if (user.bot)
            return;
        try {
            const config = await this.client.db.getGuildConfig(reaction.message.guildId);
            if (!config?.verificationEnabled ||
                config.verificationMethod !== 'emoji' ||
                config.verificationChannelId !== reaction.message.channelId) {
                return;
            }
            const expectedEmoji = config.verificationEmoji;
            const reactionEmoji = reaction.emoji.toString();
            if (expectedEmoji !== reactionEmoji)
                return;
            const guild = reaction.message.guild;
            const member = guild.members.cache.get(user.id) ??
                await guild.members.fetch(user.id).catch(() => null);
            const role = guild.roles.cache.get(config.verificationRoleId);
            if (!member || !role)
                return;
            // Add verification role
            if (!member.roles.cache.has(role.id)) {
                await member.roles.add(role);
                // Log verification
                await this.client.db.logVerification({
                    id: `${guild.id}-${user.id}-${Date.now()}`,
                    guildId: guild.id,
                    userId: user.id,
                    action: 'verified',
                    method: 'emoji'
                });
                this.client.logger.info(`Usuario verificado por emoji: ${user.tag}`, {
                    guildId: guild.id,
                    userId: user.id
                });
                // Send success DM
                const successEmbed = embeds_1.EmbedUtils.success('Verificación Completada', `¡Has sido verificado exitosamente en ${guild.name}!`);
                try {
                    await user.send({ embeds: [successEmbed] });
                }
                catch (error) {
                    this.client.logger.warn(`No se pudo enviar DM de confirmación a ${user.tag}`, { error });
                }
            }
        }
        catch (error) {
            this.client.logger.error('Error en verificación por emoji', { error });
        }
    }
    async handleKeywordVerification(message) {
        if (message.author.bot)
            return;
        try {
            const config = await this.client.db.getGuildConfig(message.guildId);
            if (!config?.verificationEnabled ||
                config.verificationMethod !== 'keyword' ||
                config.verificationChannelId !== message.channelId) {
                return;
            }
            const keyword = config.verificationKeyword?.toLowerCase();
            const messageContent = message.content.toLowerCase().trim();
            if (keyword !== messageContent)
                return;
            const member = message.member;
            const role = message.guild.roles.cache.get(config.verificationRoleId);
            if (!member || !role)
                return;
            // Delete the keyword message
            try {
                await message.delete();
            }
            catch (error) {
                this.client.logger.warn('No se pudo eliminar mensaje de verificación', { error });
            }
            // Add verification role
            if (!member.roles.cache.has(role.id)) {
                await member.roles.add(role);
                // Log verification
                await this.client.db.logVerification({
                    id: `${message.guildId}-${message.author.id}-${Date.now()}`,
                    guildId: message.guildId,
                    userId: message.author.id,
                    action: 'verified',
                    method: 'keyword'
                });
                this.client.logger.info(`Usuario verificado por palabra clave: ${message.author.tag}`, {
                    guildId: message.guildId,
                    userId: message.author.id
                });
                // Send success DM
                const successEmbed = embeds_1.EmbedUtils.success('Verificación Completada', `¡Has sido verificado exitosamente en ${message.guild.name}!`);
                try {
                    await message.author.send({ embeds: [successEmbed] });
                }
                catch (error) {
                    this.client.logger.warn(`No se pudo enviar DM de confirmación a ${message.author.tag}`, { error });
                }
            }
        }
        catch (error) {
            this.client.logger.error('Error en verificación por palabra clave', { error });
        }
    }
    async handleButtonVerification(interaction) {
        if (interaction.customId !== 'verify_button')
            return;
        try {
            const config = await this.client.db.getGuildConfig(interaction.guildId);
            if (!config?.verificationEnabled || config.verificationMethod !== 'button') {
                return;
            }
            const member = interaction.member;
            const role = interaction.guild.roles.cache.get(config.verificationRoleId);
            if (!role) {
                return interaction.reply({
                    content: 'Error: Rol de verificación no encontrado.',
                    ephemeral: true
                });
            }
            if (member.roles.cache.has(role.id)) {
                return interaction.reply({
                    content: '¡Ya estás verificado!',
                    ephemeral: true
                });
            }
            // Add verification role
            await member.roles.add(role);
            // Log verification
            await this.client.db.logVerification({
                id: `${interaction.guildId}-${member.user.id}-${Date.now()}`,
                guildId: interaction.guildId,
                userId: member.user.id,
                action: 'verified',
                method: 'button'
            });
            this.client.logger.info(`Usuario verificado por botón: ${member.user.tag}`, {
                guildId: interaction.guildId,
                userId: member.user.id
            });
            await interaction.reply({
                content: '✅ ¡Verificación completada exitosamente!',
                ephemeral: true
            });
        }
        catch (error) {
            this.client.logger.error('Error en verificación por botón', { error });
            await interaction.reply({
                content: '❌ Error durante la verificación. Inténtalo de nuevo.',
                ephemeral: true
            });
        }
    }
}
exports.VerificationHandler = VerificationHandler;
//# sourceMappingURL=verification.js.map