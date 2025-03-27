declare namespace NodeJS {
  interface ProcessEnv {
    SECRET: string;
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
  }
}
