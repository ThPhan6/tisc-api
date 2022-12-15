import * as hapi from "@hapi/hapi";
import dotenv from "dotenv";
dotenv.config();
//
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";
//
import "moment-timezone";
import moment from "moment";
export const DefaultTimezone = "Asia/Singapore";
moment.tz.setDefault(DefaultTimezone);

export const ENVIROMENT = {
  NODE_ENV: process.env.NODE_ENV ?? "dev",
  API_VERSION: process.env.API_VERSION ?? "1.0.0",
  HOST: process.env.HOST ?? "",
  PORT: process.env.PORT ?? "",
  DATABASE_HOSTNAME: process.env.DATABASE_HOSTNAME ?? "",
  DATABASE_NAME: process.env.DATABASE_NAME ?? "",
  DATABASE_USERNAME: process.env.DATABASE_USERNAME ?? "",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? "",
  API_URL: process.env.API_URL ?? "",
  SENDINBLUE_FROM: process.env.SENDINBLUE_FROM ?? "no-reply@tisc.global",
  FE_URL: process.env.FE_URL ?? "",
  SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY ?? "",
  SPACES_KEY: process.env.SPACES_KEY ?? "",
  SPACES_SECRET: process.env.SPACES_SECRET ?? "",
  SPACES_BUCKET: process.env.SPACES_BUCKET ?? "",
  SPACES_ENDPOINT: process.env.SPACES_ENDPOINT ?? "",
  SPACES_REGION: process.env.SPACES_REGION ?? "",
  X_CSCAPI_KEY: process.env.X_CSCAPI_KEY ?? "",
  TEST_TISC_ADMIN_TOKEN: process.env.TEST_TISC_ADMIN_TOKEN ?? "",
  TEST_TISC_CONSULTANT_TEAM_TOKEN:
    process.env.TEST_TISC_CONSULTANT_TEAM_TOKEN ?? "",
  SLACK_INCOMING_WEBHOOK: process.env.SLACK_INCOMING_WEBHOOK ?? "",
  SHARE_HASH_SECRET_KEY:
    process.env.SHARE_HASH_SECRET_KEY || "Cu9Zj+zNEA!5X!7^$8eZZhrw",
  MODE: process.env.MODE || "",
  LARK_OPEN_API_URL: process.env.LARK_OPEN_API_URL || "",
  LARK_APP_ID: process.env.LARK_APP_ID || "",
  LARK_APP_SECRET: process.env.LARK_APP_SECRET || "",
  LARK_CALENDAR_ID: process.env.LARK_CALENDAR_ID || "",
  LARK_USER_ID: process.env.LARK_USER_ID || "ou_2def8f86ea5122661c8d1e97a5c7eb54",
  CHECK_PERMISSION: process.env.CHECK_PERMISSION || "false",
  TISC_WEBSITE: process.env.TISC_WEBSITE || "www.tisc.global",
  ALLOW_SEND_EMAIL: process.env.ALLOW_SEND_EMAIL || '1',
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS || 'vuongd36@gmail.com',
};

export const jwtConfig = {
  jwtSecret: "aU7h3GiHb2o8H!q!ndwSqYqh&K$LCeyI",
  ttlSec: 2592000, // 1 month
};

const swaggerOptions = {
  info: {
    title: "API Documentation",
    version: ENVIROMENT.API_VERSION,
  },
  grouping: "tags",
  sortEndpoints: "ordered",
  security: [{ API_KEY: [] }],
  securityDefinitions: {
    API_KEY: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      "x-keyPrefix": "Bearer",
    },
  },
};

export const plugins: Array<hapi.ServerRegisterPluginObject<any>> = [
  {
    plugin: Inert,
  },
  {
    plugin: Vision,
  },
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
];
