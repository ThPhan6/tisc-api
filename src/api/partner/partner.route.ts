import * as Hapi from "@hapi/hapi";
import IRoute from "@/helpers/route.helper";
import PartnerController from "@/api/partner/partner.controller";
import { AUTH_NAMES, ROUTES } from "@/constants";
import validate from "@/api/partner/partner.validate";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "@/helpers/response.helper";
import response from "@/api/partner/partner.response";
import { getOneValidation } from "@/validates/common.validate";

export default class PartnerRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise<any>((resolve) => {
      const controller = new PartnerController();

      server.route([
        {
          method: "POST",
          path: ROUTES.PARTNER.CREATE_PARTNER,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create partner",
            tags: ["api", "Partner"],
            auth: AUTH_NAMES.GENERAL,
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
          path: ROUTES.PARTNER.GET_LIST_PARTNER,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list partner",
            tags: ["api", "Partner"],
            auth: AUTH_NAMES.GENERAL,
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
          path: ROUTES.PARTNER.GET_LIST_PARTNER_SUMMARY,
          options: {
            handler: controller.getCompanySummary,
            description: "Method that get list partner company summary",
            tags: ["api", "Partner"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListSummary,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.PARTNER.GET_ONE_PARTNER,
          options: {
            handler: controller.getOne,
            validate: getOneValidation,
            description: "Method that get one partner",
            tags: ["api", "Partner"],
            auth: AUTH_NAMES.GENERAL,
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
          path: ROUTES.PARTNER.UPDATE_PARTNER,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update partner",
            tags: ["api", "Partner"],
            auth: AUTH_NAMES.GENERAL,
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
          path: ROUTES.PARTNER.DELETE_PARTNER,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete partner",
            tags: ["api", "Partner"],
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
