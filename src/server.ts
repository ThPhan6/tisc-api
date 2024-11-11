import { ENVIRONMENT, plugins } from "@/config";
import * as hapi from "@hapi/hapi";
import Router from "./router";
import AuthMiddleware from "@/middlewares/auth.middleware";
import CaptchaMiddleware from "@/middlewares/captcha.middleware";
import { slackService } from "@/services/slack.service";
import path from "path";
import { emailQueue } from "./queues/email.queue";
import { databaseBackupQueue } from "./queues/database_backup.queue";
import { invoiceEmailQueue } from "./queues/invoice_mail.queue";
import { colorDetectionQueue } from "./queues/color_detection.queue";
import { activityLogService } from "./services/activityLog.service";
import { exchangeCurrencyQueue } from "./queues/exchange_currency.queue";

const server: hapi.Server = new hapi.Server({
  host: ENVIRONMENT.HOST,
  port: ENVIRONMENT.PORT,
  routes: {
    cors: {
      origin: [`*`],
      credentials: true,
      exposedHeaders: ["content-type", "content-length"],
      maxAge: 86400,
      headers: ["Accept", "Content-Type", "Authorization", "Signature"],
    },
    validate: {
      options: {
        modify: false,
        abortEarly: true,
        stripUnknown: true,
        errors: {
          wrap: {
            label: "",
          },
        },
      },
      failAction: (_request, _h, err) => {
        throw err;
      },
    },

    files: {
      relativeTo: path.join(__dirname, "../public"),
    },
  },
  debug: { request: ["error"] },
});

// catch 500 error only and push to TISC slack channel
server.events.on("response", (event: any) => {
  if (event.response?.statusCode === 500) {
    slackService.errorHook(
      event.path,
      event.method,
      event.response?._error?.stack ?? "",
      event.payload,
      event.params,
      event.query
    );
  }
});
//
server.ext("onPostAuth", (request: any, h: any) => {
  try {
    activityLogService.createActivityLog(
      request,
      h.request.auth.credentials.user_id
    );
  } catch (error) {}
  return h.continue;
});

async function start() {
  try {
    server.validator(require("joi"));
    await server.register(plugins);
    AuthMiddleware.registerAll(server);
    CaptchaMiddleware.registerAll(server);
    emailQueue.process();
    colorDetectionQueue.process();
    databaseBackupQueue.process();
    databaseBackupQueue.add();
    invoiceEmailQueue.process();
    invoiceEmailQueue.add();
    exchangeCurrencyQueue.process();
    exchangeCurrencyQueue.add();
    await Router.loadRoute(server);
    await server.start();
    server.events.on("log", (event, tags) => {
      if (
        tags.error &&
        ["staging", "production"].includes(ENVIRONMENT.NODE_ENV)
      ) {
        const plugins: any = server.plugins;
        const sentry = plugins["hapi-sentry"];
        if (sentry) {
          sentry.client.captureException(event);
        }
      }
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
  console.log("API documents at:", server.info.uri + "/documentation");
}

start();
