import * as Hapi from "@hapi/hapi";
import CollectionController from "./collection.controller";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import CollectionResponse from "./collection.response";
import commonValidate from "../../validate/common.validate";
import validate from "./collection.validate";

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
            validate: commonValidate.getListJustWithLimitOffset,
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
      ]);

      resolve(true);
    });
  }
}
