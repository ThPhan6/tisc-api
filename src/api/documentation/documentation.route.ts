import * as Hapi from "@hapi/hapi";
import agreementPoliciesTermsController from "./documentation.controller";
import validate from "./documentation.validate";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import documentation from "./documentation.response";
import { ROUTES } from "../../constant/api.constant";
import commonValidate from "../../validate/common.validate";
export default class AgreementPoliciesTermsRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new agreementPoliciesTermsController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_DOCUMENTATION,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create documentation",
            tags: ["api", "documentation"],
            auth: false,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: documentation.documentation,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_DOCUMENTATION,
          options: {
            handler: controller.getList,
            validate: commonValidate.getList,
            description: "Method that get list documentation",
            tags: ["api", "documentation"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: documentation.documentations,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_DOCUMENTATION,
          options: {
            handler: controller.getById,
            validate: validate.getById,
            description: "Method that get documentation by ID",
            tags: ["api", "documentation"],
            auth: false,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: documentation.documentation,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_DOCUMENTATION,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update documentation",
            tags: ["api", "documentation"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: documentation.documentation,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_DOCUMENTATION,
          options: {
            handler: controller.delete,
            validate: validate.getById,
            description: "Method that delete documentation",
            tags: ["api", "documentation"],
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
