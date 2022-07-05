import { generalMessageResponse } from "./../../helper/response.helper";
import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import validate from "./distributor.validate";
import response from "./distributor.response";
import DistributorController from "./distributor.controller";
export default class DistributorRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new DistributorController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_DISTRIBUTOR,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create distributor",
            tags: ["api", "Distributor"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_DISTRIBUTOR,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list distributor",
            tags: ["api", "Distributor"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getList,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_DISTRIBUTOR,
          options: {
            handler: controller.getOne,
            validate: validate.getOne,
            description: "Method that get one distributor",
            tags: ["api", "Distributor"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.UPDATE_DISTRIBUTOR,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update distributor",
            tags: ["api", "Distributor"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_DISTRIBUTOR,
          options: {
            handler: controller.delete,
            validate: validate.getOne,
            description: "Method that delete distributor",
            tags: ["api", "Distributor"],
            auth: AUTH_NAMES.PERMISSION,
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
