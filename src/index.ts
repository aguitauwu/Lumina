import { Client, GatewayIntentBits, Partials, REST, Routes, Collection } from 'discord.js';
import { config } from 'dotenv';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { SmartDatabaseManager } from './database/smart-manager';
import { createLogger } from './utils/logger';
import { AutoRoleHandler } from './handlers/autoroles';
import { VerificationHandler } from './handlers/verification';
import { WelcomeGoodbyeHandler } from './handlers/welcome-goodbye';
import { PrefixCommandHandler } from './handlers/prefix-commands';
import type { ExtendedClient } from './types/discord';

// Load environment variables
config();

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
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember
  ]
}) as ExtendedClient;

async function main() {
  try {
    // Initialize services
    console.log('🚀 Iniciando Lumina Bot...');
    
    client.logger = createLogger('LuminaBot');
    client.db = new SmartDatabaseManager();
    
    // Initialize handlers
    const autoRoleHandler = new AutoRoleHandler(client);
    const verificationHandler = new VerificationHandler(client);
    const welcomeGoodbyeHandler = new WelcomeGoodbyeHandler(client);
    const prefixCommandHandler = new PrefixCommandHandler(client);
    
    // Store handlers on client for access in events
    (client as any).autoRoleHandler = autoRoleHandler;
    (client as any).verificationHandler = verificationHandler;
    (client as any).welcomeGoodbyeHandler = welcomeGoodbyeHandler;
    (client as any).prefixCommandHandler = prefixCommandHandler;
    
    // Load events
    const eventsPath = join(__dirname, 'events');
    const eventFiles = (await readdir(eventsPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    
    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = (await import(filePath)).default;
      
      if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(...args));
      } else {
        client.on(event.name, (...args: any[]) => event.execute(...args));
      }
      
      console.log(`📡 Evento cargado: ${event.name}`);
    }
    
    // Register slash commands
    await registerCommands();
    
    // Initialize database
    await client.db.init();
    
    // Login to Discord
    await client.login(process.env.DISCORD_TOKEN);
    
  } catch (error) {
    console.error('❌ Error iniciando el bot:', error);
    process.exit(1);
  }
}

async function registerCommands() {
  const commands = [];
  
  // Load commands
  const commandsPath = join(__dirname, 'commands');
  const commandFiles = (await readdir(commandsPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
  
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);
    
    if (command.data && command.execute) {
      commands.push(command.data.toJSON());
      console.log(`⚡ Comando cargado: ${command.data.name}`);
    }
  }
  
  // Register commands with Discord
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
  
  try {
    console.log('🔄 Registrando comandos slash...');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands }
    );
    
    console.log(`✅ ${commands.length} comandos registrados exitosamente`);
  } catch (error) {
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