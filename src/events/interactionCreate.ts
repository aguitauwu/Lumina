import { Events, Interaction, ButtonInteraction } from 'discord.js';
import { ExtendedClient } from '../types/discord';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    const client = interaction.client as ExtendedClient;

    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      // Import commands dynamically
      try {
        let command;
        
        switch (interaction.commandName) {
          case 'setup-verification':
            command = await import('../commands/setup-verification');
            break;
          case 'setup-autoroles':
            command = await import('../commands/setup-autoroles');
            break;
          case 'add-autorole':
            command = await import('../commands/add-autorole');
            break;
          case 'config':
            command = await import('../commands/config');
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

      } catch (error) {
        client.logger.error(`Error ejecutando comando ${interaction.commandName}:`, { error });
        
        const errorMessage = '❌ Ocurrió un error al ejecutar este comando.';
        
        try {
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
          } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
          }
        } catch (interactionError) {
          client.logger.error('Error respondiendo a interacción expirada:', { interactionError });
        }
      }
    }

    // Handle button interactions
    if (interaction.isButton()) {
      const verificationHandler = (client as any).verificationHandler;
      
      if (interaction.customId === 'verify_button') {
        await verificationHandler.handleButtonVerification(interaction as ButtonInteraction);
      }
    }
  }
};