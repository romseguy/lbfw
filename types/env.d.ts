declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      SECRET: string;
      NEXT_PUBLIC_API: string;
      NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: string;
      NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_SHORT_URL: string;
    }
  }
}
