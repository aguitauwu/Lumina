# 🌟 Lumina Bot

<div align="center">

<img src="assets/lumina-avatar.jpg" alt="Lumina Bot Avatar" width="200" height="200" style="border-radius: 50%; border: 3px solid #7289DA;"/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-3776AB?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-7289DA?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Bot de Discord en español con sistema de verificación, bienvenidas y autoroles**

*Configuración simple con comandos slash y base de datos automática*

[📋 Ver Comandos](#-comandos) • [🚀 Instalación](#-instalación) • [⚙️ Configuración](#️-configuración) • [🗄️ Base de Datos](#️-base-de-datos)

</div>

---

## ✨ Características

### 🛡️ **Sistema de Verificación**
- **3 métodos disponibles**: Emoji, palabra clave, o botón
- **Mensajes DM**: Instrucciones automáticas por privado
- **Confirmación**: DM de éxito al verificarse
- **Logs**: Registro completo de verificaciones

### 👋 **Bienvenidas y Despedidas**
- **Mensajes personalizables**: Variables como `{user}`, `{server}`, `{member_count}`
- **Canal o DM**: Enviar en canal público o mensaje privado
- **Embeds opcionales**: Activar/desactivar embeds
- **Imágenes dinámicas**: `{user_avatar}`, `{server_icon}`

### 🎭 **Autoroles por Reacciones**
- **Sistema simple**: Reaccionar para obtener rol
- **Reversible**: Quitar reacción = quitar rol
- **Un mensaje**: Todos los roles en un solo mensaje
- **Emojis personalizados**: Unicode y emojis del servidor

### 🗄️ **Base de Datos Inteligente**
- **Detección automática**: PostgreSQL → MongoDB → Almacenamiento local
- **Sin configuración**: Funciona sin base de datos externa
- **Backups**: Scripts incluidos para respaldo

---

## 📋 Comandos

El bot soporta **slash commands** (`/comando`) y **comandos de prefijo** (`!comando`). 

> ℹ️ **Nota**: Los slash commands globales pueden tardar hasta 1 hora en aparecer la primera vez.

### 🎦 **Comandos de Prefijo Disponibles**
| Comando | Descripción |
|---------|--------------|
| `!help` | Ver ayuda general |
| `!ping` | Verificar latencia del bot |
| `!bienvenida` | Configurar bienvenidas (modo rápido) |
| `!verificacion` | Configurar verificación (modo rápido) |
| `!autoroles` | Configurar autoroles (modo rápido) |

### ⚙️ **Slash Commands** (Recomendados)

### ⚙️ **Configuración Básica**
| Comando | Descripción |
|---------|-------------|
| `/config` | Ver configuración actual del servidor |
| `/set-prefix` | Cambiar prefijo para comandos de texto |

### 🛡️ **Verificación**
| Comando | Descripción |
|---------|-------------|
| `/setup-verification` | Configurar sistema de verificación (emoji/keyword/button) |
| `/unverified-list` | Ver usuarios no verificados |

### 👋 **Bienvenidas y Despedidas**
| Comando | Descripción |
|---------|-------------|
| `/setup-welcome` | Configurar mensajes de bienvenida |
| `/setup-goodbye` | Configurar mensajes de despedida |

### 🎭 **Autoroles**
| Comando | Descripción |
|---------|-------------|
| `/setup-autoroles` | Configurar mensaje base de autoroles |
| `/add-autorole` | Añadir emoji y rol al sistema |

### 🎨 **Personalización**
| Comando | Descripción |
|---------|-------------|
| `/customize-embeds` | Personalizar colores y diseño de embeds |

---

## 🚀 Instalación

### 📋 **Requisitos**
- Node.js 18+
- Bot de Discord creado en [Discord Developer Portal](https://discord.com/developers/applications)

### 🔧 **Pasos**

```bash
# 1. Clonar repositorio
git clone https://github.com/aguitauwu/Lumina.git
cd Lumina

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar
npm run dev
```

---

## ⚙️ Configuración

### 🔑 **Variables de Entorno (.env)**

```env
# REQUERIDO
DISCORD_TOKEN=tu_token_del_bot
DISCORD_CLIENT_ID=tu_application_id

# OPCIONAL - Base de datos (si no se configura, usa almacenamiento local)
DATABASE_URL=postgresql://user:pass@host:5432/db
# O
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### 🛡️ **Permisos del Bot**
En Discord Developer Portal, habilitar:
- `bot` scope
- `applications.commands` scope
- **Privileged Gateway Intents**: 
  - Message Content Intent
  - Server Members Intent ⚠️ **(REQUERIDO para verificación y bienvenidas)**

**Bot Permissions**:
- Manage Roles
- Send Messages
- View Channels
- Read Message History
- Use Slash Commands
- Add Reactions
- Manage Messages

---

## 🗄️ Base de Datos

El bot detecta automáticamente qué sistema usar:

### 🥇 **PostgreSQL** (Prioridad 1)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

### 🥈 **MongoDB** (Prioridad 2)
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
```

### 🥉 **Almacenamiento Local** (Respaldo automático)
- No requiere configuración
- Crea archivos JSON en carpeta `data/`
- Respaldo manual vía script (`npm run backup`)

### 📊 **Scripts de Base de Datos**
```bash
# Ver estado de la base de datos
npm run health

# Crear backup (solo almacenamiento local)
npm run backup

# Ver datos (solo PostgreSQL)
npm run db:studio
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Ejecutar con hot-reload
npm run build         # Compilar TypeScript
npm start            # Ejecutar versión compilada

# Base de datos
npm run db:push      # Aplicar cambios de esquema
npm run db:studio    # Interfaz web para PostgreSQL
npm run health       # Verificar conexión
npm run backup       # Crear respaldo

# Utilidades
npm run clean        # Limpiar archivos temporales
```

---

## 🏗️ Estructura del Proyecto

```
Lumina/
├── src/
│   ├── commands/          # Comandos slash
│   ├── database/          # Gestores de base de datos
│   │   ├── connection.ts  # PostgreSQL (Drizzle)
│   │   ├── mongodb.ts     # MongoDB (Mongoose)
│   │   ├── local-storage.ts # Almacenamiento JSON
│   │   └── smart-manager.ts # Selector automático
│   ├── events/            # Eventos de Discord
│   ├── handlers/          # Lógica de negocio
│   │   ├── autoroles.ts   # Sistema de autoroles
│   │   ├── verification.ts # Sistema de verificación
│   │   └── welcome-goodbye.ts # Bienvenidas/despedidas
│   ├── types/             # Definiciones TypeScript
│   ├── utils/             # Utilidades (embeds, logger)
│   └── index.ts           # Punto de entrada
├── assets/                # Imágenes del bot
├── data/                  # Almacenamiento local (auto-generado)
├── logs/                  # Archivos de log
├── .env.example          # Plantilla de configuración
└── package.json          # Dependencias y scripts
```

---

## 🆘 Problemas Comunes

### ❌ **Error: "Invalid token"**
1. Verificar `DISCORD_TOKEN` en `.env`
2. Regenerar token en Discord Developer Portal
3. Asegurar que **Message Content Intent** esté habilitado

### 🗄️ **Error de base de datos**
1. Verificar URL de conexión
2. El bot automáticamente usará almacenamiento local como respaldo
3. Ejecutar `npm run health` para diagnosticar

### 🔧 **Error: "Missing permissions"**
1. Verificar permisos del bot en el servidor
2. Asegurar que tenga rol con permisos suficientes
3. Verificar que `DISCORD_CLIENT_ID` sea correcto

---

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crear** rama: `git checkout -b feature/nueva-funcionalidad`
3. **Commit**: `git commit -m 'Add: función increíble'`
4. **Push**: `git push origin feature/nueva-funcionalidad`
5. **Pull Request**: Abrir PR con descripción detallada

---

## 📄 Licencia

**MIT License** - Ver [LICENSE](LICENSE) para más detalles

---

<div align="center">

## 🌟 **¡Gracias por usar Lumina Bot!**

**Si te gusta este proyecto, ¡dale una ⭐ estrella!**

[![GitHub Stars](https://img.shields.io/github/stars/aguitauwu/Lumina?style=social)](https://github.com/aguitauwu/Lumina/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/aguitauwu/Lumina?style=social)](https://github.com/aguitauwu/Lumina/network/members)

[**🔗 Repositorio Principal**](https://github.com/aguitauwu/Lumina) • [**📋 Issues**](https://github.com/aguitauwu/Lumina/issues) • [**💬 Discussions**](https://github.com/aguitauwu/Lumina/discussions)

**Hecho con ❤️ para la comunidad hispanohablante de Discord**

</div>