# Overview

Lumina is a comprehensive Discord bot built with TypeScript that provides verification systems and auto-role management for Discord servers. The bot offers multiple verification methods (emoji reactions, keyword verification, and button interactions) and allows administrators to set up role assignment systems based on user reactions to specific messages.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
The application follows a modular event-driven architecture built on Discord.js v14:

- **Entry Point**: `src/index.ts` initializes the Discord client with necessary intents and partials for handling guild members, messages, and reactions
- **Event Handlers**: Separate event files in `src/events/` handle Discord events (ready, member join, message creation, reactions)
- **Command System**: Slash commands in `src/commands/` provide administrative functionality for configuring verification and auto-roles
- **Handler Classes**: Specialized handlers (`AutoRoleHandler`, `VerificationHandler`) encapsulate business logic for core features
- **Extended Client**: Custom client interface that extends Discord.js Client with database manager and logger instances

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Three main tables:
  - `guild_configs`: Stores per-server configuration including verification settings and auto-role definitions
  - `verification_logs`: Tracks user verification events and actions
  - `user_join_logs`: Monitors user join patterns and verification status
- **JSON Fields**: Auto-roles stored as JSONB arrays within guild configs for flexible role definitions

## Core Features

### Verification System
- **Multiple Methods**: Supports emoji reactions, keyword verification, and button interactions
- **Configurable**: Per-guild settings for verification channels, roles, and methods
- **Logging**: Comprehensive tracking of verification events and user actions
- **DM Notifications**: Automatic welcome messages with verification instructions

### Auto-Role Management
- **Reaction-Based**: Users can self-assign roles by reacting to configured messages
- **Admin Tools**: Commands for adding/configuring auto-roles with emoji-role mappings
- **Dynamic Updates**: Real-time role assignment and removal based on reaction changes

## Logging and Monitoring
- **Winston Logger**: Structured logging with daily file rotation and console output
- **Event Tracking**: Detailed logging of user actions, command executions, and system events
- **Error Handling**: Comprehensive error catching with context preservation

## Configuration Management
- **Environment Variables**: Secure handling of Discord tokens and database credentials
- **Per-Guild Settings**: Individual configuration storage for each Discord server
- **Admin-Only Commands**: Permission-restricted configuration commands

## Security Considerations
- **Permission Checks**: Admin-only access to configuration commands
- **Input Validation**: Zod integration for type-safe data validation
- **Error Isolation**: Graceful error handling prevents system crashes
- **Database Security**: Parameterized queries through Drizzle ORM

# External Dependencies

## Discord Integration
- **Discord.js v14**: Primary framework for Discord bot functionality
- **Required Permissions**: Guild members, messages, reactions, and role management
- **Intents**: Configured for guild operations, member events, and message handling

## Database
- **PostgreSQL**: Primary database for persistent storage
- **Drizzle ORM**: Type-safe database toolkit with schema migrations
- **Connection Pooling**: pg library for efficient database connections

## Development Tools
- **TypeScript**: Type safety and modern JavaScript features
- **tsx**: Development server with hot reloading
- **Winston**: Structured logging with file rotation
- **Zod**: Runtime type validation and parsing

## Environment Requirements
- `DISCORD_TOKEN`: Bot authentication token
- `DISCORD_CLIENT_ID`: Application client ID for command registration
- `DATABASE_URL`: PostgreSQL connection string
- Optional: `LOG_LEVEL`, `NODE_ENV` for environment-specific configuration