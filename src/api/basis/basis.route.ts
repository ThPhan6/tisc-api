import { generalMessageResponse } from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import * as Hapi from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import commonValidate from "../../validate/common.validate";
import BasisController from "./basis.controller";
import validate from "./basis.validate";
import basisResponse from "./basis.response";
export default class BasisRoutes implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new BasisController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_BASIS_CONVERSION,
          options: {
            handler: controller.createBasisConversion,
            validate: validate.createBasisConverison,
            description: "Method that create basis conversion",
            tags: ["api", "Bases"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: basisResponse.basisConversion,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_BASIS_CONVERSION,
          options: {
            handler: controller.getBasesConversion,
            validate: commonValidate.getList,
            description: "Method that get bases conversion",
            tags: ["api", "Bases"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: basisResponse.basesConversion,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_BASIS_CONVERSION,
          options: {
            handler: controller.getBasisConversionById,
            validate: commonValidate.getOne,
            description: "Method that get basis conversion",
            tags: ["api", "Bases"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: basisResponse.basisConversion,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_BASIS_CONVERSION,
          options: {
            handler: controller.updateBasisConversion,
            validate: validate.updateBasisConverison,
            description: "Method that update basis conversion",
            tags: ["api", "Bases"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: basisResponse.basisConversion,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_BASIS_CONVERSION,
          options: {
            handler: controller.deleteBasisConversion,
            validate: commonValidate.getOne,
            description: "Method that delete basis conversion",
            tags: ["api", "Bases"],
            // auth: AUTH_NAMES.PERMISSION,
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
