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

    // Welcome command
    this.commands.set('bienvenida', {
      name: 'bienvenida',
      description: 'Configurar mensajes de bienvenida',
      usage: 'bienvenida <on/off> [#canal] [mensaje]',
      permissions: ['Administrator'],
      execute: async (message: Message, args: string[]) => {
        if (!message.member?.permissions.has('Administrator')) {
          await message.reply('❌ No tienes permisos de administrador.');
          return;
        }

        if (!args[0] || !['on', 'off', 'activar', 'desactivar'].includes(args[0].toLowerCase())) {
          await message.reply('❌ Uso: `bienvenida <on/off> [#canal] [mensaje]`\n' +
            'Variables disponibles: {user}, {server}, {member_count}');
          return;
        }

        const enabled = ['on', 'activar'].includes(args[0].toLowerCase());
        const channelMention = message.mentions.channels.first();
        const customMessage = args.slice(2).join(' ');

        const config = await this.client.db.getGuildConfig(message.guildId!);

        if (enabled && !channelMention && !config?.welcomeChannelId) {
          await message.reply('❌ Debes mencionar un canal para activar las bienvenidas.');
          return;
        }

        const updates = {
          welcomeEnabled: enabled,
          welcomeChannelId: channelMention?.id || config?.welcomeChannelId,
          welcomeMessage: customMessage || config?.welcomeMessage || '¡Bienvenido {user} a **{server}**! 🎉'
        };

        await this.client.db.updateGuildConfig(message.guildId!, updates);

        const embed = EmbedUtils.success(
          'Bienvenidas Configuradas',
          `✅ **Estado:** ${enabled ? 'Activado' : 'Desactivado'}\n` +
          (enabled ? `📍 **Canal:** ${channelMention || `<#${updates.welcomeChannelId}>`}\n` : '') +
          `📝 **Variables:** {user}, {server}, {member_count}`
        );

        await message.reply({ embeds: [embed] });
      }
    });

    // Goodbye command
    this.commands.set('despedida', {
      name: 'despedida',
      description: 'Configurar mensajes de despedida',
      usage: 'despedida <on/off> [#canal] [mensaje]',
      permissions: ['Administrator'],
      execute: async (message: Message, args: string[]) => {
        if (!message.member?.permissions.has('Administrator')) {
          await message.reply('❌ No tienes permisos de administrador.');
          return;
        }

        if (!args[0] || !['on', 'off', 'activar', 'desactivar'].includes(args[0].toLowerCase())) {
          await message.reply('❌ Uso: `despedida <on/off> [#canal] [mensaje]`\n' +
            'Variables disponibles: {user}, {server}, {member_count}');
          return;
        }

        const enabled = ['on', 'activar'].includes(args[0].toLowerCase());
        const channelMention = message.mentions.channels.first();
        const customMessage = args.slice(2).join(' ');

        const config = await this.client.db.getGuildConfig(message.guildId!);

        if (enabled && !channelMention && !config?.goodbyeChannelId) {
          await message.reply('❌ Debes mencionar un canal para activar las despedidas.');
          return;
        }

        const updates = {
          goodbyeEnabled: enabled,
          goodbyeChannelId: channelMention?.id || config?.goodbyeChannelId,
          goodbyeMessage: customMessage || config?.goodbyeMessage || '👋 **{user}** se ha ido de **{server}**.'
        };

        await this.client.db.updateGuildConfig(message.guildId!, updates);

        const embed = EmbedUtils.success(
          'Despedidas Configuradas',
          `✅ **Estado:** ${enabled ? 'Activado' : 'Desactivado'}\n` +
          (enabled ? `📍 **Canal:** ${channelMention || `<#${updates.goodbyeChannelId}>`}\n` : '') +
          `📝 **Variables:** {user}, {server}, {member_count}`
        );

        await message.reply({ embeds: [embed] });
      }
    });

    // Verification command
    this.commands.set('verificacion', {
      name: 'verificacion',
      description: 'Configurar sistema de verificación',
      usage: 'verificacion <emoji/keyword/button> [#canal] [@rol] [texto]',
      permissions: ['Administrator'],
      execute: async (message: Message, args: string[]) => {
        if (!message.member?.permissions.has('Administrator')) {
          await message.reply('❌ No tienes permisos de administrador.');
          return;
        }

        if (!args[0] || !['emoji', 'keyword', 'button'].includes(args[0].toLowerCase())) {
          await message.reply('❌ Uso: `verificacion <emoji/keyword/button> [#canal] [@rol] [texto]`\n' +
            'Métodos: emoji, keyword, button');
          return;
        }

        const method = args[0].toLowerCase() as 'emoji' | 'keyword' | 'button';
        const channelMention = message.mentions.channels.first();
        const roleMention = message.mentions.roles.first();
        const customText = args.slice(3).join(' ');

        if (!channelMention || !roleMention) {
          await message.reply('❌ Debes mencionar un canal y un rol para la verificación.');
          return;
        }

        const updates = {
          verificationEnabled: true,
          verificationMethod: method,
          verificationChannelId: channelMention.id,
          verificationRoleId: roleMention.id,
          verificationMessage: customText || 'Para verificarte, sigue las instrucciones del bot.',
          verificationEmoji: '✅',
          verificationKeyword: method === 'keyword' ? (customText || 'verificar') : undefined
        };

        await this.client.db.updateGuildConfig(message.guildId!, updates);

        const embed = EmbedUtils.success(
          'Verificación Configurada',
          `✅ **Método:** ${method}\n` +
          `📍 **Canal:** ${channelMention}\n` +
          `🎭 **Rol:** ${roleMention}\n` +
          (method === 'keyword' ? `🔑 **Palabra:** ${updates.verificationKeyword}\n` : '')
        );

        await message.reply({ embeds: [embed] });
      }
    });

    // Autoroles command
    this.commands.set('autoroles', {
      name: 'autoroles',
      description: 'Gestionar sistema de autoroles',
      usage: 'autoroles <add/setup/list> [emoji] [@rol] [descripción]',
      permissions: ['Administrator'],
      execute: async (message: Message, args: string[]) => {
        if (!message.member?.permissions.has('Administrator')) {
          await message.reply('❌ No tienes permisos de administrador.');
          return;
        }

        const action = args[0]?.toLowerCase();
        
        if (!action || !['add', 'setup', 'list', 'agregar', 'configurar', 'lista'].includes(action)) {
          await message.reply('❌ Uso: `autoroles <add/setup/list> [argumentos]`\n' +
            '• `add` - Agregar nuevo autorole\n' +
            '• `setup` - Configurar mensaje de autoroles\n' +
            '• `list` - Ver autoroles configurados');
          return;
        }

        if (['add', 'agregar'].includes(action)) {
          const emoji = args[1];
          const role = message.mentions.roles.first();
          const description = args.slice(3).join(' ') || 'Sin descripción';

          if (!emoji || !role) {
            await message.reply('❌ Uso: `autoroles add <emoji> @rol [descripción]`');
            return;
          }

          const config = await this.client.db.getGuildConfig(message.guildId!);
          const currentAutoRoles = config?.autoRoles || [];

          // Check if emoji or role already exists
          if (currentAutoRoles.find((ar: any) => ar.emoji === emoji)) {
            await message.reply(`❌ El emoji ${emoji} ya está en uso.`);
            return;
          }

          if (currentAutoRoles.find((ar: any) => ar.roleId === role.id)) {
            await message.reply(`❌ El rol ${role} ya tiene un autorole asignado.`);
            return;
          }

          const newAutoRole = {
            emoji: emoji,
            roleId: role.id,
            roleName: role.name,
            description: description
          };

          const updatedAutoRoles = [...currentAutoRoles, newAutoRole];

          await this.client.db.updateGuildConfig(message.guildId!, {
            autoRoles: updatedAutoRoles
          });

          const embed = EmbedUtils.success(
            'Autorole Agregado',
            `✅ **Emoji:** ${emoji}\n` +
            `🎭 **Rol:** ${role}\n` +
            `📝 **Descripción:** ${description}`
          );

          await message.reply({ embeds: [embed] });

        } else if (['list', 'lista'].includes(action)) {
          const config = await this.client.db.getGuildConfig(message.guildId!);
          const autoRoles = config?.autoRoles || [];

          if (autoRoles.length === 0) {
            await message.reply('❌ No hay autoroles configurados.');
            return;
          }

          const rolesList = autoRoles.map((ar: any) => 
            `${ar.emoji} **${ar.roleName}** - ${ar.description}`
          ).join('\n');

          const embed = EmbedUtils.info(
            'Autoroles Configurados',
            rolesList
          );

          await message.reply({ embeds: [embed] });

        } else if (['setup', 'configurar'].includes(action)) {
          const channelMention = message.mentions.channels.first();
          
          if (!channelMention) {
            await message.reply('❌ Uso: `autoroles setup #canal [título] [descripción]`');
            return;
          }

          const title = args.slice(2).join(' ') || 'Selecciona tus roles';
          
          const config = await this.client.db.getGuildConfig(message.guildId!);
          const autoRoles = config?.autoRoles || [];

          if (autoRoles.length === 0) {
            await message.reply('❌ Primero agrega autoroles con `autoroles add`');
            return;
          }

          await message.reply('⚙️ Configurando autoroles... (usa los slash commands para funcionalidad completa)');
        }
      }
    });

    // Embeds customization command
    this.commands.set('embeds', {
      name: 'embeds',
      description: 'Personalizar embeds del bot',
      usage: 'embeds <color/thumbnail/footer/reset> [valor]',
      permissions: ['Administrator'],
      execute: async (message: Message, args: string[]) => {
        if (!message.member?.permissions.has('Administrator')) {
          await message.reply('❌ No tienes permisos de administrador.');
          return;
        }

        const setting = args[0]?.toLowerCase();
        const value = args.slice(1).join(' ');

        if (!setting || !['color', 'thumbnail', 'footer', 'reset'].includes(setting)) {
          await message.reply('❌ Uso: `embeds <color/thumbnail/footer/reset> [valor]`\n' +
            '• `color #ff0000` - Cambiar color (hexadecimal)\n' +
            '• `thumbnail URL` - Cambiar miniatura\n' +
            '• `footer texto` - Cambiar pie de página\n' +
            '• `reset` - Resetear configuración');
          return;
        }

        let updates = {};
        let successMessage = '';

        if (setting === 'reset') {
          updates = {
            embedColor: '#0099ff',
            embedThumbnail: null,
            embedFooter: null
          };
          successMessage = '✅ Configuración de embeds reseteada';

        } else if (setting === 'color') {
          if (!value || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
            await message.reply('❌ Formato de color inválido. Usa formato hexadecimal: #ff0000');
            return;
          }
          updates = { embedColor: value };
          successMessage = `✅ Color cambiado a: ${value}`;

        } else if (setting === 'thumbnail') {
          updates = { embedThumbnail: value || null };
          successMessage = value ? '✅ Thumbnail actualizada' : '✅ Thumbnail removida';

        } else if (setting === 'footer') {
          updates = { embedFooter: value || null };
          successMessage = value ? '✅ Footer actualizado' : '✅ Footer removido';
        }

        await this.client.db.updateGuildConfig(message.guildId!, updates);

        const config = await this.client.db.getGuildConfig(message.guildId!);
        const embed = EmbedUtils.success(
          'Embeds Personalizados',
          successMessage + '\n\n**Este es un ejemplo de cómo se verán los embeds ahora.**',
          config || undefined
        );

        await message.reply({ embeds: [embed] });
      }
    });

    // Prefix command
    this.commands.set('prefijo', {
      name: 'prefijo',
      description: 'Cambiar prefijo del bot',
      usage: 'prefijo <nuevo_prefijo>',
      permissions: ['Administrator'],
      execute: async (message: Message, args: string[]) => {
        if (!message.member?.permissions.has('Administrator')) {
          await message.reply('❌ No tienes permisos de administrador.');
          return;
        }

        if (!args[0]) {
          await message.reply('❌ Uso: `prefijo <nuevo_prefijo>`\n' +
            'El prefijo debe ser de máximo 3 caracteres y sin espacios.');
          return;
        }

        const newPrefix = args[0];

        if (newPrefix.length > 3) {
          await message.reply('❌ El prefijo no puede tener más de 3 caracteres.');
          return;
        }

        if (newPrefix.includes(' ')) {
          await message.reply('❌ El prefijo no puede contener espacios.');
          return;
        }

        await this.client.db.updateGuildConfig(message.guildId!, {
          prefix: newPrefix
        });

        const embed = EmbedUtils.success(
          'Prefijo Actualizado',
          `✅ El prefijo ha sido cambiado a: \`${newPrefix}\`\n\n` +
          `Ahora puedes usar comandos como:\n` +
          `• \`${newPrefix}help\` - Ver ayuda\n` +
          `• \`${newPrefix}bienvenida\` - Configurar bienvenidas\n` +
          `• \`${newPrefix}verificacion\` - Sistema de verificación`
        );

        await message.reply({ embeds: [embed] });
      }
    });

    // Images command
    this.commands.set('imagenes', {
      name: 'imagenes',
      description: 'Configurar imágenes para embeds de bienvenida y despedida',
      usage: 'imagenes <bienvenida/despedida> [URL/{user_avatar}/{server_icon}/remove] o adjunta una imagen',
      permissions: ['Administrator'],
      execute: async (message: Message, args: string[]) => {
        if (!message.member?.permissions.has('Administrator')) {
          await message.reply('❌ No tienes permisos de administrador.');
          return;
        }

        if (!args[0] || !['bienvenida', 'despedida', 'welcome', 'goodbye'].includes(args[0].toLowerCase())) {
          await message.reply('❌ Uso: `imagenes <bienvenida/despedida> <imagen>`\n\n' +
            '**Opciones de imagen:**\n' +
            '• **Adjuntar imagen** - Sube una imagen desde tu galería\n' +
            '• `URL` - URL de imagen personalizada\n' +
            '• `{user_avatar}` - Avatar del usuario que se une/sale\n' +
            '• `{server_icon}` - Icono del servidor\n' +
            '• `remove` - Eliminar imagen\n\n' +
            '**Ejemplos:**\n' +
            '`imagenes bienvenida {user_avatar}`\n' +
            '`imagenes despedida https://imagen.com/fondo.png`\n' +
            'O adjunta una imagen al mensaje');
          return;
        }

        const type = ['bienvenida', 'welcome'].includes(args[0].toLowerCase()) ? 'welcome' : 'goodbye';
        let imageValue = args.slice(1).join(' ');

        // Check if there's an attachment (uploaded image)
        const attachment = message.attachments.first();
        if (attachment && this.isImageAttachment(attachment)) {
          imageValue = attachment.url;
        }

        if (!imageValue) {
          await message.reply('❌ Debes especificar una imagen, placeholder o adjuntar una imagen.');
          return;
        }

        // Validate URL if not using placeholders or remove
        if (imageValue !== 'remove' && 
            imageValue !== '{user_avatar}' && 
            imageValue !== '{server_icon}' && 
            !this.isValidUrl(imageValue)) {
          await message.reply('❌ La URL proporcionada no es válida.');
          return;
        }

        const configField = type === 'welcome' ? 'welcomeEmbedImage' : 'goodbyeEmbedImage';
        const updates = {
          [configField]: imageValue === 'remove' ? null : imageValue
        };

        await this.client.db.updateGuildConfig(message.guildId!, updates);

        let description = '';
        if (imageValue === 'remove') {
          description = `✅ Imagen de ${type === 'welcome' ? 'bienvenida' : 'despedida'} eliminada.`;
        } else if (imageValue === '{user_avatar}') {
          description = `✅ Ahora se usará el **avatar del usuario** como imagen de ${type === 'welcome' ? 'bienvenida' : 'despedida'}.`;
        } else if (imageValue === '{server_icon}') {
          description = `✅ Ahora se usará el **icono del servidor** como imagen de ${type === 'welcome' ? 'bienvenida' : 'despedida'}.`;
        } else if (attachment) {
          description = `✅ **Imagen subida desde tu galería** configurada para ${type === 'welcome' ? 'bienvenidas' : 'despedidas'}.\n🖼️ La imagen se mostrará en todos los mensajes de ${type === 'welcome' ? 'bienvenida' : 'despedida'}.`;
        } else {
          description = `✅ **Imagen personalizada** configurada para ${type === 'welcome' ? 'bienvenidas' : 'despedidas'}.`;
        }

        const config = await this.client.db.getGuildConfig(message.guildId!);
        const embed = EmbedUtils.success(
          'Imagen Configurada',
          description,
          config || undefined
        );

        // Create preview embed
        let previewImageUrl = '';
        if (imageValue === '{user_avatar}' && message.member) {
          previewImageUrl = message.member.user.displayAvatarURL({ size: 512 });
        } else if (imageValue === '{server_icon}' && message.guild) {
          previewImageUrl = message.guild.iconURL({ size: 512 }) || '';
        } else if (imageValue !== 'remove') {
          previewImageUrl = imageValue;
        }

        // Show preview if we have an image
        if (previewImageUrl) {
          embed.setImage(previewImageUrl);
        }

        await message.reply({ embeds: [embed] });
      }
    });
  }

  private isValidUrl(string: string): boolean {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  private isImageAttachment(attachment: any): boolean {
    // Check content type first
    if (attachment.contentType?.startsWith('image/')) {
      return true;
    }
    
    // Fallback to extension check
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'];
    const fileName = attachment.name?.toLowerCase() || '';
    
    if (imageExtensions.some(ext => fileName.endsWith(ext))) {
      return true;
    }
    
    // Fallback to checking if it has width (Discord images have this property)
    return attachment.width != null;
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