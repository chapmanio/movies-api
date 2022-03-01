export {};

declare global {
  const ENVIRONMENT: 'dev' | 'prod';
  const DATABASE_URL: string;
  const MOVIE_API_KEY: string;
  const JWT_SECRET: string;
  const COOKIE_DOMAIN: string | undefined;
}
