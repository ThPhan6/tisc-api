import { ENVIROMENT } from "@/config";
import * as hapi from "@hapi/hapi";
import Router from "./router";

import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";
import AuthMiddleware from "./middleware/auth.middleware";
import CaptchaMiddleware from "./middleware/captcha.middleware";
import { slackService } from "./service/slack.service";
import path from "path";

const swaggerOptions = {
  info: {
    title: "API Documentation",
    version: "3.0.0",
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

const plugins: Array<hapi.ServerRegisterPluginObject<any>> = [
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

const server: hapi.Server = new hapi.Server({
  host: ENVIROMENT.HOST,
  port: ENVIROMENT.PORT,
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
        abortEarly: false,
        stripUnknown: true,
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

async function start() {
  try {
    server.validator(require("joi"));
    await server.register(plugins);
    AuthMiddleware.registerAll(server);
    CaptchaMiddleware.registerAll(server);
    await Router.loadRoute(server);
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
  console.log("API documents at:", server.info.uri + "/documentation");
}

start();
