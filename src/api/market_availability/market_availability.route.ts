import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import * as Hapi from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import IRoute from "../../helper/route.helper";
import MarketAvailabilityController from "./market_availability.controller";
import validate from "./market_availability.validate";
import commonValidate from "../../validate/common.validate";
import response from "./market_availability.response";
export default class MarketAvailabilityRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new MarketAvailabilityController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_MARKET_AVAILABILITY,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get market availability list",
            tags: ["api", "MarketAvailability"],
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
          path: ROUTES.GET_ONE_MARKET_AVAILABILITY,
          options: {
            handler: controller.get,
            validate: commonValidate.getOne,
            description: "Method that get market availability",
            tags: ["api", "MarketAvailability"],
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
          path: ROUTES.UPDATE_MARKET_AVAILABILITY,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update market availability",
            tags: ["api", "MarketAvailability"],
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
          path: ROUTES.GET_MARKET_AVAILABILITY_GROUP_BY_COLLECTION,
          options: {
            handler: controller.getMarketAvailabilityGroupByCollection,
            validate: validate.getWithBrandId,
            description:
              "Method that get list market availability group by collection",
            tags: ["api", "MarketAvailability"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                // 200: response.getOne,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
