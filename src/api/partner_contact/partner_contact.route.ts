import * as Hapi from "@hapi/hapi";
import IRoute from "@/helpers/route.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
import validate from "@/api/partner_contact/partner_contact.validate";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "@/helpers/response.helper";
import response from "@/api/partner_contact/partner_contact.response";
import { getOneValidation } from "@/validates/common.validate";
import PartnerContactController from "./partner_contact.controller";

export default class PartnerContactRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise<any>((resolve) => {
      const controller = new PartnerContactController();

      server.route([
        {
          method: "POST",
          path: ROUTES.PARTNER_CONTACT.CREATE_PARTNER_CONTACT,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create partner contact",
            tags: ["api", "Partner Contact"],
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
          path: ROUTES.PARTNER_CONTACT.GET_LIST_PARTNER_CONTACT,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list partner contact",
            tags: ["api", "Partner Contact"],
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
          path: ROUTES.PARTNER_CONTACT.GET_ONE_PARTNER_CONTACT,
          options: {
            handler: controller.get,
            validate: getOneValidation,
            description: "Method that get one partner contact",
            tags: ["api", "Partner Contact"],
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
          path: ROUTES.PARTNER_CONTACT.UPDATE_PARTNER_CONTACT,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update partner contact",
            tags: ["api", "Partner Contact"],
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
          path: ROUTES.PARTNER_CONTACT.DELETE_PARTNER_CONTACT,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete partner contact",
            tags: ["api", "Partner Contact"],
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
          method: "POST",
          path: ROUTES.PARTNER_CONTACT.INVITE_PARTNER_CONTACT,
          options: {
            handler: controller.invite,
            validate: getOneValidation,
            description: "Method that invite partner contact",
            tags: ["api", "Partner Contact"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
