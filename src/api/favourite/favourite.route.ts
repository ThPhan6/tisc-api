import * as Hapi from "@hapi/hapi";
import FavouriteController from "./favourite.controller";
// import commonValidate from "@/validate/common.validate";
import validate from "./favourite.validate";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import response from "./favourite.response";
import { ROUTES } from "@/constants";

export default class FavouriteRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new FavouriteController();
      server.route([
        {
          method: "POST",
          path: ROUTES.FAVOURITE.SKIP,
          options: {
            handler: controller.skip,
            description: "Method that skip to retrieve favourite product",
            tags: ["api", "favourite"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.FAVOURITE.RETRIEVE,
          options: {
            handler: controller.retrieve,
            validate: validate.retrieve,
            description: "Method that retrieve favourite product",
            tags: ["api", "favourite"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.FAVOURITE.SUMMARY,
          options: {
            handler: controller.getFavoriteProductSummary,
            description: "Method that get summary of favourite products",
            tags: ["api", "favourite"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.favoriteProductSummary,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.FAVOURITE.LIST,
          options: {
            handler: controller.getProductList,
            validate: validate.getProductList,
            description: "Method that get list of favourite products",
            tags: ["api", "favourite"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getProductList,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
