"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction) {
        const client = interaction.client;
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            // Import commands dynamically
            try {
                let command;
                switch (interaction.commandName) {
                    case 'setup-verification':
                        command = await Promise.resolve().then(() => __importStar(require('../commands/setup-verification')));
                        break;
                    case 'setup-autoroles':
                        command = await Promise.resolve().then(() => __importStar(require('../commands/setup-autoroles')));
                        break;
                    case 'add-autorole':
                        command = await Promise.resolve().then(() => __importStar(require('../commands/add-autorole')));
                        break;
                    case 'config':
                        command = await Promise.resolve().then(() => __importStar(require('../commands/config')));
                        break;
                    default:
                        return;
                }
                await command.execute(interaction);
                client.logger.info(`Comando ejecutado: ${interaction.commandName} por ${interaction.user.tag}`, {
                    guildId: interaction.guildId,
                    userId: interaction.user.id,
                    command: interaction.commandName
                });
            }
            catch (error) {
                client.logger.error(`Error ejecutando comando ${interaction.commandName}:`, { error });
                const errorMessage = '❌ Ocurrió un error al ejecutar este comando.';
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                }
                else {
                    await interaction.reply({ content: errorMessage, ephemeral: true });
                }
            }
        }
        // Handle button interactions
        if (interaction.isButton()) {
            const verificationHandler = client.verificationHandler;
            if (interaction.customId === 'verify_button') {
                await verificationHandler.handleButtonVerification(interaction);
            }
        }
    }
};
//# sourceMappingURL=interactionCreate.js.map