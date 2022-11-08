import * as Hapi from "@hapi/hapi";
import CollectionController from "./collection.controller";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
import CollectionResponse from "./collection.response";
import validate from "./collection.validate";
import { getOneValidation } from "@/validate/common.validate";

export default class CollectionRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CollectionController();

      server.route([
        {
          method: "GET",
          path: ROUTES.COLLECTION.GET_LIST,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list collection",
            tags: ["api", "Collection"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: CollectionResponse.getList,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.COLLECTION.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create one collection",
            tags: ["api", "Collection"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: CollectionResponse.getOne,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.COLLECTION.UPDATE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update name of collection",
            tags: ["api", "Collection"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.COLLECTION.DELETE,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete collection",
            tags: ["api", "Collection"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
