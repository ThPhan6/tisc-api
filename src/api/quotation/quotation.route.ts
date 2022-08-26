import { generalMessageResponse } from "./../../helper/response.helper";
import * as Hapi from "@hapi/hapi";
import commonValidate from "../../validate/common.validate";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import validate from "./quotation.validate";
import response from "./quotation.response";
import QuotationController from "./quotation.controller";
export default class QuotationRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new QuotationController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_QUOTATION,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create inspirational quotation",
            tags: ["api", "Inspirational Quotation"],
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
          path: ROUTES.GET_LIST_QUOTATION,
          options: {
            handler: controller.getList,
            validate: commonValidate.getList,
            description: "Method that get list inspirational quotation",
            tags: ["api", "Inspirational Quotation"],
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
          path: ROUTES.GET_ONE_QUOTATION,
          options: {
            handler: controller.getOne,
            validate: commonValidate.getOne,
            description: "Method that get one inspirational quotation",
            tags: ["api", "Inspirational Quotation"],
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
          path: ROUTES.EDIT_QUOTATION,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that get one inspirational quotation",
            tags: ["api", "Inspirational Quotation"],
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
          path: ROUTES.DELETE_QUOTATION,
          options: {
            handler: controller.delete,
            validate: commonValidate.getOne,
            description: "Method that get one inspirational quotation",
            tags: ["api", "Inspirational Quotation"],
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
          path: ROUTES.GET_LIST_QUOTATION_NOT_AUTH,
          options: {
            handler: controller.getList,
            validate: commonValidate.getList,
            description:
              "Method that get list inspirational quotation for landing page",
            tags: ["api", "Inspirational Quotation"],
            auth: false,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getList,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
