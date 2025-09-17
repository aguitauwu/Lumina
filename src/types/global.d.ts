declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      DATABASE_URL: string;
      NODE_ENV: 'development' | 'production';
      LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
    }
  }
}

export {};