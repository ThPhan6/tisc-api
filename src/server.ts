import * as hapi from "@hapi/hapi";
import Router from "./router";
import * as dotenv from "dotenv";
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";
import AuthMiddleware from "./middleware/auth.middleware";
import path from "path";

dotenv.config();
const swaggerOptions = {
  info: {
    title: "Test API Documentation",
    version: "1.0.0",
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
  host: process.env.HOST,
  port: process.env.PORT,
  routes: {
    cors: {
      origin: [`*`],
      credentials: true,
      exposedHeaders: ["content-type", "content-length"],
      maxAge: 86400,
      headers: ["Accept", "Content-Type", "Authorization"],
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

async function start() {
  try {
    await server.validator(require("joi"));
    await server.register(plugins);
    AuthMiddleware.registerAll(server);
    await Router.loadRoute(server);
    server.route({
      method: "GET",
      path: "/public/{param*}",
      options: {
        auth: false,
        handler(request, h) {
          return h.file(request.path.slice(8));
        },
      },
    });
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
  console.log("API documents at:", server.info.uri + "/documentation");
}

start();
