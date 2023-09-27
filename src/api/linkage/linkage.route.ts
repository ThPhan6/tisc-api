import * as Hapi from "@hapi/hapi";
import IRoute from "@/helpers/route.helper";
import validate from "./linkage.validate";
import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helpers/response.helper";
import response from "./linkage.response";
import { linkageController } from "./linkage.controller";

export default class LinkageRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      server.route([
        {
          method: "POST",
          path: ROUTES.UPSERT_LINKAGE,
          options: {
            handler: linkageController.upsertLinkages,
            validate: validate.upsertLinkages,
            description: "Method that upsert linkages",
            tags: ["api", "Linkage"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.PAIR_LINKAGE,
          options: {
            handler: linkageController.pairOrUnpair,
            validate: validate.pair,
            description: "Method that pair or unpair linkage",
            tags: ["api", "Linkage"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LINKAGES,
          options: {
            handler: linkageController.getLinkages,
            validate: validate.getLinkage,
            description: "Method that get related linkages",
            tags: ["api", "Linkage"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.linkages,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.UPSERT_STEP,
          options: {
            handler: linkageController.upsertStep,
            validate: validate.upsertStep,
            description: "Method that upsert Steps",
            tags: ["api", "Linkage Step"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_STEPS,
          options: {
            handler: linkageController.getSteps,
            validate: validate.getStep,
            description: "Method that get Steps",
            tags: ["api", "Linkage Step"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.steps,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LINKAGE_REST_OPTIONS,
          options: {
            handler: linkageController.getLinkageRestOptions,
            validate: validate.getLinkageRestOptions,
            description: "Method that get linkage rest options",
            tags: ["api", "Linkage Step"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.linkage_rest_options,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.UPSERT_CONFIGURATION_STEP,
          options: {
            handler: linkageController.upsertConfigurationStep,
            validate: validate.upsertConfigurationStep,
            description: "Method that upsert Configuration Steps",
            tags: ["api", "Configuration Step"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.VALIDATE_CONFIGURATION_STEP,
          options: {
            handler: linkageController.validateConfigurationStep,
            validate: validate.upsertConfigurationStep,
            description: "Method that validate Configuration Steps",
            tags: ["api", "Configuration Step"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.isValidConfigurationSteps,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_CONFIGURATION_STEPS,
          options: {
            handler: linkageController.getConfigurationSteps,
            validate: validate.getStep,
            description: "Method that get Configuration Steps",
            tags: ["api", "Configuration Step"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.configurationSteps,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
