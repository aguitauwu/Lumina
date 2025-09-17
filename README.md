# 🌟 LUMINA BOT

<div align="center">

<img src="assets/lumina-avatar.jpg" alt="Lumina Bot Avatar" width="200" height="200" style="border-radius: 50%; border: 3px solid #7289DA;"/>

![LUMINA Banner](https://img.shields.io/badge/-LUMINA_BOT-7289DA?style=for-the-badge&labelColor=#5865F2)

[![Node.js](https://img.shields.io/badge/Node.js-18+-3776AB?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14+-7289DA?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supported-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Supported-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**¡El bot de Discord más completo en español! 🚀**

*Bot especializado en sistemas de verificación, bienvenidas personalizables, autoroles inteligentes y embeds avanzados*

## 🚀 **¡Úsalo AHORA en Replit!**

[![Run on Replit](https://img.shields.io/badge/🔥_Usar_en_Replit-4DFF4D?style=for-the-badge&logo=replit&logoColor=white)](https://replit.com)

**¿Quieres probar Lumina Bot inmediatamente sin instalación?** ¡Solo haz clic arriba! 🎉

[📋 Ver Comandos](#-comandos-disponibles) • [🌐 Usar en Replit](#-usar-en-replit-súper-fácil) • [🚀 Instalación Local](#-instalación-local) • [💻 VS Code/Cursor](#-instalación-en-editores) • [🗄️ Base de Datos](#-sistema-de-base-de-datos) • [📖 Documentación](#-documentación)

</div>

---

## ✨ Características Principales

<table>
<tr>
<td width="50%">

### 👋 **Sistema de Bienvenidas Avanzado**
- **Mensajes personalizables**: Texto e imagen totalmente customizable
- **Embeds elegantes**: Colores, thumbnails y footers personalizados
- **Imágenes dinámicas**: Avatar del usuario, icono del servidor o imagen personalizada
- **Subir desde galería**: Sube imágenes directamente desde tu teléfono/PC

### 🛡️ **Verificación Inteligente**
- **Múltiples métodos**: Reacciones, palabras clave, botones
- **Anti-spam**: Sistema de baneos automáticos configurables
- **Mensajes DM**: Instrucciones personalizadas por mensaje privado
- **Logs completos**: Seguimiento de todas las verificaciones

</td>
<td width="50%">

### 🎭 **Autoroles Dinámicos**
- **Sistema de reacciones**: Usuarios obtienen roles al reaccionar
- **Gestión fácil**: Comandos para añadir y configurar roles
- **Mensajes embed**: Presentación elegante de opciones de roles
- **Múltiples configuraciones**: Varios mensajes de autoroles por servidor

### 🗄️ **Triple Sistema de Base de Datos**
- **PostgreSQL**: Base de datos principal robusta
- **MongoDB**: Alternativa NoSQL moderna
- **Almacenamiento local**: Backup automático en archivos JSON
- **Detección inteligente**: Selección automática según disponibilidad

</td>
</tr>
</table>

---

## 🤖 Interfaz 100% en Español

<div align="center">
<img src="https://img.shields.io/badge/🇪🇸-Interfaz_en_Español-FF6B6B?style=for-the-badge&labelColor=FFA726" alt="Español"/>
</div>

### 🌟 **¡Lumina habla tu idioma!**

Todo el bot está diseñado pensando en la comunidad hispanohablante:

**🎯 Características en Español:**
- ✅ **Comandos intuitivos** - `!bienvenida`, `!verificacion`, `!autoroles`
- ✅ **Mensajes claros** - Sin términos técnicos confusos
- ✅ **Configuración sencilla** - Guías paso a paso en español
- ✅ **Ayuda contextual** - Ejemplos y explicaciones detalladas
- ✅ **Embeds profesionales** - Diseño elegante con colores personalizables

### 💬 **Ejemplos de comandos:**

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| 🔗 **Comando con prefijo** | `!comando [argumentos]` | `!bienvenida #general ¡Bienvenido al servidor!` |
| 🖼️ **Subir imagen** | `!imagenes bienvenida` + adjuntar imagen | Sube una imagen desde tu galería |
| ⚙️ **Configuración rápida** | `!help` | Ver todos los comandos disponibles |

---

## 📋 Comandos Disponibles

### 👥 **Comandos para Usuarios**
| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `!help` | ❓ Ver lista completa de comandos | `!help` |
| `!prefijo nuevo_prefijo` | 🔧 Cambiar prefijo del bot | `!prefijo ?` |

### 🛡️ **Comandos para Administradores**

#### 🌟 Bienvenidas y Despedidas
| Comando | Descripción | Permisos |
|---------|-------------|----------|
| `!bienvenida #canal mensaje` | 👋 Configurar mensajes de bienvenida | Administrador |
| `!despedida #canal mensaje` | 👋 Configurar mensajes de despedida | Administrador |
| `!imagenes bienvenida [imagen/URL]` | 🖼️ Configurar imagen de bienvenida | Administrador |

#### 🔐 Verificación
| Comando | Descripción | Permisos |
|---------|-------------|----------|
| `!verificacion #canal @role` | 🛡️ Configurar sistema de verificación | Administrador |

#### 🎭 Autoroles
| Comando | Descripción | Permisos |
|---------|-------------|----------|
| `!autoroles agregar emoji @role` | ⚡ Añadir autorole con emoji | Administrador |
| `!autoroles configurar #canal` | 🎯 Configurar canal de autoroles | Administrador |

#### 🎨 Personalización
| Comando | Descripción | Permisos |
|---------|-------------|----------|
| `!embeds color #hexcolor` | 🌈 Cambiar color de embeds | Administrador |
| `!embeds thumbnail URL` | 🖼️ Configurar thumbnail por defecto | Administrador |

---

## 🚀 Instalación Local

### 📋 **Prerrequisitos**

```bash
Node.js 18+ ✅
Discord Developer Account ✅  
Una base de datos (opcional) ✅
Discord Bot Token ✅
```

### 🔧 **Instalación Rápida**

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

### 🔗 **Variables de Entorno (.env)**

```env
# Discord Configuration (REQUERIDO)
DISCORD_TOKEN=tu_token_del_bot_aqui
DISCORD_CLIENT_ID=tu_client_id_aqui

# Base de Datos (Solo UNA opción necesaria)
# PostgreSQL (recomendado)
DATABASE_URL=postgresql://user:password@host:port/database

# MongoDB (alternativa)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lumina

# Almacenamiento local (automático si no hay BD)
# No requiere configuración - usa archivos JSON
```

---

## 🌐 Usar en Replit (¡Súper Fácil!)

### 🚀 **Opción 1: Fork Directo**

[![Run on Replit](https://img.shields.io/badge/🔥_Fork_en_Replit-4DFF4D?style=for-the-badge&logo=replit&logoColor=white)](#)

**¡La forma más rápida de empezar!** 

1. **Haz Fork del proyecto** - Crea tu propia copia
2. **Configura las variables de entorno en Secrets:**
   - `DISCORD_TOKEN` - Token de tu bot de Discord
   - `DISCORD_CLIENT_ID` - Client ID de tu aplicación
   - `DATABASE_URL` o `MONGODB_URI` - (opcional)
3. **Presiona Run** - ¡Tu bot estará activo inmediatamente!

### 🎯 **Opción 2: Desde Cero en Replit**

1. **Crear nuevo Repl:**
   - Ve a [Replit.com](https://replit.com)
   - Crea nuevo Repl: Node.js
   - Nombra tu proyecto: "Lumina-Bot"

2. **Importar código:**
   ```bash
   # En el terminal de Replit
   git clone https://github.com/aguitauwu/Lumina.git .
   npm install
   ```

3. **Configurar Secrets:**
   - Ir a **Secrets** tab (candado) en la barra lateral
   - Agregar las variables del `.env.example`

4. **Ejecutar:**
   ```bash
   npm run dev
   ```

### 💡 **Ventajas de Replit:**

- ✅ **Sin instalación**: Todo en el navegador
- ✅ **Hosting gratuito**: Tu bot estará online 24/7
- ✅ **Fácil configuración**: Secrets integrados
- ✅ **Colaboración**: Comparte tu bot fácilmente
- ✅ **Auto-restart**: Si se cae, se reinicia automáticamente

---

## 💻 Instalación en Editores

### 🎯 **Visual Studio Code**

<details>
<summary><b>📝 Configuración Completa para VS Code</b></summary>

1. **Instalar VS Code y abrir proyecto:**
   ```bash
   # Descargar VS Code: https://code.visualstudio.com/
   # Clonar repositorio
   git clone https://github.com/aguitauwu/Lumina.git
   
   # Abrir en VS Code
   code Lumina
   ```

2. **Extensiones recomendadas:**
   - **TypeScript and JavaScript Language Features** (incluida)
   - **Discord.js Snippets** - Autocompletado para Discord.js
   - **MongoDB for VS Code** - Explorador de MongoDB integrado
   - **GitLens** - Historial y blame de Git avanzado
   - **ESLint** - Linting de código TypeScript
   - **Prettier** - Formateo automático de código

3. **Setup completo paso a paso:**
   ```bash
   # Terminal integrado: Ctrl+Shift+`
   
   # 1. Instalar dependencias
   npm install
   
   # 2. Configurar variables de entorno
   cp .env.example .env
   # Editar .env con tus credenciales (Ctrl+P -> .env)
   
   # 3. Configurar Discord Bot:
   # - Ir a https://discord.com/developers/applications
   # - Crear nueva aplicación
   # - Bot > Reset Token > Copiar token
   # - Pegar en DISCORD_TOKEN en .env
   # - Habilitar "Message Content Intent"
   
   # 4. Ejecutar proyecto
   npm run dev
   
   # ✅ Verificar en terminal: "✅ Bot conectado como Lumina#8903"
   ```

4. **Features útiles de VS Code:**
   - **Ctrl+P**: Búsqueda rápida de archivos
   - **Ctrl+Shift+P**: Paleta de comandos
   - **F12**: Ir a definición
   - **Ctrl+`**: Terminal integrado

</details>

### 🎯 **Cursor / Windsurf**

<details>
<summary><b>🤖 Configuración con IA Integrada</b></summary>

1. **Instalar Cursor o Windsurf:**
   ```bash
   # Cursor: https://cursor.sh/
   # Windsurf: https://codeium.com/windsurf
   # Abrir: File > Open Folder > Lumina
   ```

2. **Ventajas con IA:**
   - IA integrada detecta Discord.js automáticamente
   - `Ctrl+K` para chat con IA sobre el código
   - `Ctrl+L` para explicaciones línea por línea

3. **Flujo de trabajo:**
   ```bash
   npm install
   # Configurar .env con ayuda de IA
   npm run dev
   ```

</details>

---

## 🗄️ Sistema de Base de Datos

### 🎯 **Detección Automática Inteligente**

```javascript
🔍 Detectando sistemas de base de datos disponibles...
🔄 Probando conexión con POSTGRESQL...
✅ Sistema de base de datos activo: POSTGRESQL
```

### 🏆 **Prioridad de Selección:**

1. **🥇 PostgreSQL** - Base de datos principal (SQL robusta)
2. **🥈 MongoDB** - Alternativa moderna (NoSQL flexible)
3. **🥉 Almacenamiento Local** - Respaldo automático (archivos JSON)

### 🔧 **Configuración por Base de Datos**

#### PostgreSQL (Recomendado)
```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/lumina_bot
```

**Ventajas:**
- ✅ Ideal para producción
- ✅ ACID compliance
- ✅ Consultas SQL potentes
- ✅ Escalabilidad alta

#### MongoDB (Alternativa NoSQL)
```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/lumina_bot
```

**Ventajas:**
- ✅ Documentos JSON nativos
- ✅ Esquemas flexibles
- ✅ Escalabilidad horizontal
- ✅ Atlas cloud gratuito

#### Almacenamiento Local (Fallback)
```bash
# Sin configuración necesaria
# Crea automáticamente: ./data/lumina-data.json
```

**Ventajas:**
- ✅ Sin dependencias externas
- ✅ Backups automáticos
- ✅ Ideal para desarrollo
- ✅ Fácil migración

### 🔄 **Scripts de Utilidad**

```bash
# Verificar salud de la base de datos
npm run health

# Crear backup (solo local storage)
npm run backup

# Ver datos en tiempo real (PostgreSQL)
npm run db:studio
```

---

## 🎮 Funcionalidades

### 🌟 **Sistema de Bienvenidas**

- ✅ **Mensajes personalizados**: Placeholders como `{user}`, `{server}`
- ✅ **Imágenes dinámicas**: `{user_avatar}`, `{server_icon}` o URLs personalizadas  
- ✅ **Subir desde galería**: Adjunta imágenes directamente en Discord
- ✅ **Embeds elegantes**: Colores, títulos, footers personalizables
- ✅ **DMs opcionales**: Mensajes privados de bienvenida

### 🔐 **Sistema de Verificación**

- ✅ **Múltiples métodos**: Emoji, palabra clave, botones
- ✅ **Anti-spam inteligente**: Baneos automáticos configurables
- ✅ **Logs completos**: Seguimiento de todas las verificaciones
- ✅ **Mensajes DM**: Instrucciones personalizadas

### 🎭 **Autoroles Avanzados**

- ✅ **Sistema de reacciones**: Roles automáticos por emoji
- ✅ **Múltiples configuraciones**: Varios mensajes por servidor
- ✅ **Gestión dinámica**: Agregar/quitar roles en tiempo real
- ✅ **Embeds atractivos**: Presentación profesional

### 📝 **Logs Inteligentes**

```bash
# Ejemplos de logs del sistema
[2025-09-17 23:52:21] 🚀 Iniciando Lumina Bot...
[2025-09-17 23:52:21] 🔍 Detectando sistemas de base de datos disponibles...
[2025-09-17 23:52:21] ✅ Sistema de base de datos activo: POSTGRESQL
[2025-09-17 23:52:21] ✅ Bot conectado como Lumina#8903
[2025-09-17 23:52:25] 💬 Usuario en Servidor - Comando: !help
```

---

## 🖥️ Compatibilidad Multi-Plataforma

### 💻 **Windows**
```bash
# Scripts específicos para Windows
npm run dev:windows

# Usando PowerShell
$env:NODE_ENV="development"; npm run dev
```

### 🍎 **Mac / 🐧 Linux**
```bash
# Scripts Unix/Linux
npm run dev:unix

# Usando terminal
NODE_ENV=development npm run dev
```

### 🌐 **Scripts Cross-Platform**
```bash
# Funciona en todas las plataformas
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm run start        # Producción
npm run clean        # Limpiar archivos temporales
```

---

## 🤖 Arquitectura Técnica

### 🏗️ **Estructura del Proyecto**

```
Lumina/
├── src/
│   ├── commands/              # 📋 Comandos slash
│   ├── database/              # 🗄️ Gestores de base de datos
│   │   ├── connection.ts      # PostgreSQL con Drizzle
│   │   ├── mongodb.ts         # MongoDB con Mongoose
│   │   ├── local-storage.ts   # Almacenamiento JSON local
│   │   └── smart-manager.ts   # Selección inteligente
│   ├── events/                # 📡 Eventos de Discord
│   ├── handlers/              # ⚡ Lógica de negocio
│   ├── types/                 # 🏷️ Definiciones TypeScript
│   ├── utils/                 # 🛠️ Utilidades
│   └── index.ts               # 🚀 Punto de entrada
├── assets/                    # 🖼️ Imágenes y recursos
├── data/                      # 📁 Almacenamiento local (auto-generado)
├── .env.example              # ⚙️ Plantilla de configuración
├── package.json              # 📦 Dependencias y scripts
└── README.md                 # 📖 Esta documentación
```

### 🔧 **Stack Tecnológico**

- **🟢 Runtime**: Node.js 18+
- **🔷 Lenguaje**: TypeScript 5+
- **🤖 Bot Framework**: Discord.js v14
- **🐘 Base de Datos SQL**: PostgreSQL + Drizzle ORM
- **🍃 Base de Datos NoSQL**: MongoDB + Mongoose
- **📁 Almacenamiento Local**: JSON + Sistema de backups
- **📝 Build System**: TSX para desarrollo, TypeScript para producción
- **🔄 Cross-Platform**: cross-env para compatibilidad

---

## 🆘 Soporte

### 🐛 **Problemas Comunes**

<details>
<summary><b>❌ Error: "Cannot find module"</b></summary>

```bash
# Solución
rm -rf node_modules package-lock.json
npm install
```
</details>

<details>
<summary><b>🔑 Error: "Invalid token"</b></summary>

1. Verificar token en `.env`
2. Regenerar token en Discord Developer Portal
3. Asegurar que Message Content Intent esté habilitado
</details>

<details>
<summary><b>🗄️ Error de base de datos</b></summary>

1. Verificar URL de conexión en `.env`
2. Comprobar conectividad de red
3. El bot automáticamente usará almacenamiento local como fallback
</details>

<details>
<summary><b>🖼️ Error con imágenes</b></summary>

1. Verificar que la URL sea accesible públicamente
2. Formatos soportados: PNG, JPG, JPEG, GIF, WEBP
3. Usar placeholders: `{user_avatar}`, `{server_icon}`
</details>

### 📞 **Contacto**

- **🐛 Issues**: [GitHub Issues](https://github.com/aguitauwu/Lumina/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/aguitauwu/Lumina/discussions)
- **📧 Email**: Contacto directo del desarrollador

---

## 🤝 Contribuir

### 🌟 **Cómo Ayudar**

1. **🍴 Fork** el repositorio
2. **🌿 Crear** rama: `git checkout -b feature/nueva-funcionalidad`
3. **💾 Commit**: `git commit -m 'Add: función increíble'`
4. **📤 Push**: `git push origin feature/nueva-funcionalidad`
5. **📥 Pull Request**: Abrir PR con descripción detallada

### 📋 **Guidelines**

- ✅ Usar TypeScript estricto
- ✅ Mantener compatibilidad en español
- ✅ Incluir logs descriptivos con emojis
- ✅ Documentar nuevas funciones
- ✅ Testear en múltiples plataformas

---

## 📄 Licencia

**MIT License** - Libre para usar, modificar y distribuir

---

<div align="center">

## 🌟 **¡Gracias por usar Lumina Bot!**

**Si te gusta este proyecto, ¡dale una ⭐ estrella!**

[![GitHub Stars](https://img.shields.io/github/stars/aguitauwu/Lumina?style=social)](https://github.com/aguitauwu/Lumina/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/aguitauwu/Lumina?style=social)](https://github.com/aguitauwu/Lumina/network/members)

[**🔗 Repositorio Principal**](https://github.com/aguitauwu/Lumina) • [**📋 Issues**](https://github.com/aguitauwu/Lumina/issues) • [**💬 Discussions**](https://github.com/aguitauwu/Lumina/discussions)

**Hecho con ❤️ para la comunidad hispanohablante de Discord**

</div>