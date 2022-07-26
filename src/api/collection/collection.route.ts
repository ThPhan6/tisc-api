import * as Hapi from "@hapi/hapi";
import CollectionController from "./collection.controller";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import CollectionResponse from "./collection.response";
import validate from "./collection.validate";
import commonValidate from "../../validate/common.validate";

export default class CollectionRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CollectionController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_COLLECTION,
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
          path: ROUTES.CREATE_COLLECTION,
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
          method: "DELETE",
          path: ROUTES.DELETE_COLLECTION,
          options: {
            handler: controller.delete,
            validate: commonValidate.getOne,
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
