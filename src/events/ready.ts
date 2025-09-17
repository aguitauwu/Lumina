import { Events } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ExtendedClient) {
    client.logger.info(`✅ Bot conectado como ${client.user?.tag}`);
    client.logger.info(`🌟 Activo en ${client.guilds.cache.size} servidor(es)`);
    
    // Set bot status
    client.user?.setActivity('Verificando usuarios', { type: 3 });
  }
};