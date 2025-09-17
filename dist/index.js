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
const dotenv_1 = require("dotenv");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const connection_1 = require("./database/connection");
const logger_1 = require("./utils/logger");
const autoroles_1 = require("./handlers/autoroles");
const verification_1 = require("./handlers/verification");
// Load environment variables
(0, dotenv_1.config)();
// Validate required environment variables
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ DISCORD_TOKEN is required');
    process.exit(1);
}
if (!process.env.DISCORD_CLIENT_ID) {
    console.error('❌ DISCORD_CLIENT_ID is required');
    process.exit(1);
}
// Create Discord client
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessages
    ],
    partials: [
        discord_js_1.Partials.Message,
        discord_js_1.Partials.Channel,
        discord_js_1.Partials.Reaction,
        discord_js_1.Partials.User,
        discord_js_1.Partials.GuildMember
    ]
});
async function main() {
    try {
        // Initialize services
        console.log('🚀 Iniciando Lumina Bot...');
        client.logger = (0, logger_1.createLogger)('LuminaBot');
        client.db = new connection_1.DatabaseManager();
        // Initialize handlers
        const autoRoleHandler = new autoroles_1.AutoRoleHandler(client);
        const verificationHandler = new verification_1.VerificationHandler(client);
        // Store handlers on client for access in events
        client.autoRoleHandler = autoRoleHandler;
        client.verificationHandler = verificationHandler;
        // Load events
        const eventsPath = (0, path_1.join)(__dirname, 'events');
        const eventFiles = (await (0, promises_1.readdir)(eventsPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
        for (const file of eventFiles) {
            const filePath = (0, path_1.join)(eventsPath, file);
            const event = (await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)))).default;
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            }
            else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            console.log(`📡 Evento cargado: ${event.name}`);
        }
        // Register slash commands
        await registerCommands();
        // Initialize database
        await client.db.init();
        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
    }
    catch (error) {
        console.error('❌ Error iniciando el bot:', error);
        process.exit(1);
    }
}
async function registerCommands() {
    const commands = [];
    // Load commands
    const commandsPath = (0, path_1.join)(__dirname, 'commands');
    const commandFiles = (await (0, promises_1.readdir)(commandsPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = (0, path_1.join)(commandsPath, file);
        const command = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
        if (command.data && command.execute) {
            commands.push(command.data.toJSON());
            console.log(`⚡ Comando cargado: ${command.data.name}`);
        }
    }
    // Register commands with Discord
    const rest = new discord_js_1.REST().setToken(process.env.DISCORD_TOKEN);
    try {
        console.log('🔄 Registrando comandos slash...');
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
        console.log(`✅ ${commands.length} comandos registrados exitosamente`);
    }
    catch (error) {
        console.error('❌ Error registrando comandos:', error);
    }
}
// Handle process termination
process.on('SIGINT', async () => {
    console.log('🛑 Cerrando bot...');
    await client.db.close();
    client.destroy();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('🛑 Cerrando bot...');
    await client.db.close();
    client.destroy();
    process.exit(0);
});
// Start the bot
main().catch(console.error);
//# sourceMappingURL=index.js.map