import { Message, Collection } from 'discord.js';
import { ExtendedClient } from '../types/discord';
import { EmbedUtils } from '../utils/embeds';

interface PrefixCommand {
  name: string;
  description: string;
  usage: string;
  permissions?: string[];
  execute: (message: Message, args: string[], client: ExtendedClient) => Promise<void>;
}

export class PrefixCommandHandler {
  private commands: Collection<string, PrefixCommand>;

  constructor(private client: ExtendedClient) {
    this.commands = new Collection();
    this.loadCommands();
  }

  private loadCommands() {
    // Help command
    this.commands.set('help', {
      name: 'help',
      description: 'Mostrar ayuda de comandos con prefijo',
      usage: 'help [comando]',
      execute: async (message: Message, args: string[]) => {
        const prefix = await this.getPrefix(message.guildId!);
        
        if (args[0]) {
          const command = this.commands.get(args[0].toLowerCase());
          if (!command) {
            await message.reply('❌ Comando no encontrado.');
            return;
          }
          
          const embed = EmbedUtils.info(
            `Comando: ${prefix}${command.name}`,
            `**Descripción:** ${command.description}\n` +
            `**Uso:** \`${prefix}${command.usage}\`\n` +
            (command.permissions ? `**Permisos:** ${command.permissions.join(', ')}` : '')
          );
          
          await message.reply({ embeds: [embed] });
          return;
        }

        const commandList = this.commands.map(cmd => 
          `\`${prefix}${cmd.name}\` - ${cmd.description}`
        ).join('\n');

        const embed = EmbedUtils.info(
          '📚 Comandos con Prefijo',
          `**Prefijo actual:** \`${prefix}\`\n\n${commandList}\n\n` +
          `Usa \`${prefix}help <comando>\` para más información.`
        );

        await message.reply({ embeds: [embed] });
      }
    });

    // Unverified command
    this.commands.set('unverified', {
      name: 'unverified',
      description: 'Lista de usuarios no verificados',
      usage: 'unverified [horas]',
      permissions: ['ModerateMembers'],
      execute: async (message: Message, args: string[]) => {
        // Check permissions
        if (!message.member?.permissions.has('ModerateMembers')) {
          await message.reply('❌ No tienes permisos para usar este comando.');
          return;
        }

        const hours = parseInt(args[0]) || 24;
        if (isNaN(hours) || hours < 1 || hours > 168) {
          await message.reply('❌ Las horas deben ser un número entre 1 y 168.');
          return;
        }

        try {
          const config = await this.client.db.getGuildConfig(message.guildId!);
          
          if (!config?.verificationEnabled || !config.verificationRoleId) {
            await message.reply('❌ Sistema de verificación no configurado.');
            return;
          }

          const guild = message.guild!;
          const members = await guild.members.fetch();
          const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
          
          const unverifiedMembers = members
            .filter(member => {
              if (member.user.bot) return false;
              if (member.roles.cache.has(config.verificationRoleId!)) return false;
              if (member.joinedTimestamp && member.joinedTimestamp < cutoffTime) return false;
              return true;
            })
            .first(20);

          if (unverifiedMembers.length === 0) {
            await message.reply(`✅ No hay usuarios sin verificar en las últimas ${hours} horas.`);
            return;
          }

          let description = '';
          unverifiedMembers.forEach((member, index) => {
            const joinTime = member.joinedTimestamp 
              ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
              : 'Desconocido';
            
            description += `${index + 1}. **${member.user.tag}** - ${joinTime}\n`;
          });

          const embed = EmbedUtils.warning(
            `👥 ${unverifiedMembers.length} Usuarios No Verificados`,
            description
          );

          await message.reply({ embeds: [embed] });

        } catch (error) {
          this.client.logger.error('Error en comando unverified:', { error });
          await message.reply('❌ Error al obtener usuarios no verificados.');
        }
      }
    });

    // Ping command
    this.commands.set('ping', {
      name: 'ping',
      description: 'Comprobar latencia del bot',
      usage: 'ping',
      execute: async (message: Message) => {
        const sent = await message.reply('🏓 Calculando latencia...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(this.client.ws.ping);

        const embed = EmbedUtils.success(
          '🏓 Pong!',
          `**Latencia del mensaje:** ${latency}ms\n` +
          `**Latencia de la API:** ${apiLatency}ms`
        );

        await sent.edit({ content: '', embeds: [embed] });
      }
    });
  }

  async handleMessage(message: Message) {
    if (message.author.bot || !message.guild) return;

    const prefix = await this.getPrefix(message.guildId);
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = this.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args, this.client);
      
      this.client.logger.info(`Comando prefijo ejecutado: ${prefix}${commandName} por ${message.author.tag}`, {
        guildId: message.guildId,
        userId: message.author.id,
        command: commandName
      });

    } catch (error) {
      this.client.logger.error(`Error ejecutando comando prefijo ${commandName}:`, { error });
      await message.reply('❌ Ocurrió un error al ejecutar este comando.');
    }
  }

  private async getPrefix(guildId: string | null): Promise<string> {
    if (!guildId) return '!';
    try {
      const config = await this.client.db.getGuildConfig(guildId);
      return config?.prefix || '!';
    } catch (error) {
      return '!';
    }
  }
}