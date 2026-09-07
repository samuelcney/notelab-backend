declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'test' | 'production';
    PORT?: string;
    FRONTEND_URL?: string;
    // Public base URL of this API, used to build URLs for locally-stored uploads.
    API_PUBLIC_URL?: string;

    DATABASE_URL: string;
    JWT_SECRET: string;

    RESEND_API_KEY: string;
  }
}
