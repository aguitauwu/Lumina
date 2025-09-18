# Overview

Lumina Bot is a comprehensive Spanish Discord bot built with Node.js and TypeScript. It provides essential server management features including user verification systems, role management through reactions, welcome/goodbye messages, and customizable embeds. The bot is designed for ease of use with slash commands and includes a smart database system that automatically adapts to available infrastructure.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Framework
- **Discord.js v14** as the primary Discord API wrapper
- **TypeScript 5+** for type safety and better development experience
- **Node.js 18+** runtime environment

## Smart Database System
The application uses a hierarchical database detection system that automatically selects the best available storage solution:

1. **PostgreSQL (Primary)** - Uses Drizzle ORM with connection pooling for production environments
2. **MongoDB (Secondary)** - Mongoose-based implementation as fallback
3. **Local Storage (Fallback)** - JSON file-based storage for development or environments without external databases

This smart system allows the bot to function in any environment without manual database configuration, automatically falling back to simpler storage solutions when enterprise databases are unavailable.

## Event-Driven Architecture
The bot follows Discord.js event patterns with dedicated handlers for:
- **Verification Handler** - Manages three verification methods (emoji, keyword, button)
- **AutoRole Handler** - Processes reaction-based role assignment/removal
- **Welcome/Goodbye Handler** - Manages member join/leave messaging
- **Prefix Command Handler** - Handles traditional text commands alongside slash commands

## Command System
Dual command support structure:
- **Slash Commands** - Modern Discord interactions for administrative functions
- **Prefix Commands** - Traditional text-based commands for quick operations
- Commands are dynamically imported to improve startup performance

## Configuration Management
Guild-specific configurations stored in database with comprehensive settings for:
- Verification systems with multiple authentication methods
- Customizable embed styling and colors
- Welcome/goodbye message templates with variable substitution
- Role automation through reaction monitoring
- Prefix customization per server

## Logging and Monitoring
- **Winston logger** with daily log rotation
- Structured logging with metadata for debugging
- Separate log levels for development and production
- Automatic log cleanup with 14-day retention

# External Dependencies

## Discord Integration
- **Discord.js v14** - Primary bot framework and API wrapper
- **Discord REST API** - Command registration and management

## Database Technologies
- **Drizzle ORM** - Type-safe PostgreSQL operations with schema management
- **node-postgres (pg)** - PostgreSQL connection handling and pooling
- **Mongoose** - MongoDB object modeling and connection management
- **better-sqlite3** - Local SQLite database for fallback storage

## Development and Build Tools
- **TypeScript** - Static typing and compilation
- **tsx** - TypeScript execution and hot reloading for development
- **cross-env** - Cross-platform environment variable handling
- **Drizzle Kit** - Database schema generation and migration tools

## Utility Libraries
- **Winston** - Structured logging with rotation support
- **winston-daily-rotate-file** - Automatic log file management
- **dotenv** - Environment variable management
- **Zod** - Runtime type validation and schema parsing

## Optional Integrations
The bot is designed to work with:
- **PostgreSQL databases** (recommended for production)
- **MongoDB instances** (alternative NoSQL option)
- **File system storage** (development and minimal deployments)