import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  jwtSecret: "aU7h3GiHb2o8H!q!ndwSqYqh&K$LCeyI",
  ttlSec: 2592000, // 1 month
};

export const ENVIROMENT = {
  NODE_ENV: process.env.NODE_ENV ?? 'dev',
  API_VERSION: process.env.API_VERSION ?? '1.0.0',
  HOST: process.env.HOST ?? '',
  PORT: process.env.PORT ?? '',
  DATABASE_HOSTNAME: process.env.DATABASE_HOSTNAME ?? '',
  DATABASE_NAME: process.env.DATABASE_NAME ?? '',
  DATABASE_USERNAME: process.env.DATABASE_USERNAME ?? '',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? '',
  API_URL: process.env.API_URL ?? '',
  SENDINBLUE_FROM: process.env.SENDINBLUE_FROM ?? '',
  FE_URL: process.env.FE_URL ?? '',
  SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY ?? '',
  SPACES_KEY: process.env.SPACES_KEY ?? '',
  SPACES_SECRET: process.env.SPACES_SECRET ?? '',
  SPACES_BUCKET: process.env.SPACES_BUCKET ?? '',
  SPACES_ENDPOINT: process.env.SPACES_ENDPOINT ?? '',
  SPACES_REGION: process.env.SPACES_REGION ?? '',
  X_CSCAPI_KEY: process.env.X_CSCAPI_KEY ?? '',
  TEST_TISC_ADMIN_TOKEN: process.env.TEST_TISC_ADMIN_TOKEN ?? '',
  TEST_TISC_CONSULTANT_TEAM_TOKEN: process.env.TEST_TISC_CONSULTANT_TEAM_TOKEN ?? '',
  SLACK_INCOMING_WEBHOOK: process.env.SLACK_INCOMING_WEBHOOK ?? '',
  SHARE_HASH_SECRET_KEY: process.env.SHARE_HASH_SECRET_KEY || "Cu9Zj+zNEA!5X!7^$8eZZhrw",
  MODE: process.env.MODE || "",
  LARK_OPEN_API_URL: process.env.LARK_OPEN_API_URL || "",
  LARK_APP_ID: process.env.LARK_APP_ID || "",
  LARK_APP_SECRET: process.env.LARK_APP_SECRET || "",
  LARK_CALENDAR_ID: process.env.LARK_CALENDAR_ID || "",
}
