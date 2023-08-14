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
      ]);

      resolve(true);
    });
  }
}
