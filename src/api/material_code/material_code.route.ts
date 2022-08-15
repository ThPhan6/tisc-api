import { ROUTES } from "./../../constant/api.constant";
import * as Hapi from "@hapi/hapi";
import MaterialCodeController from "./material_code.controller";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import ProductResponse from "./material_code.response";
import validate from "./material_code.validate";
import commonValidate from "../../validate/common.validate";

export default class MaterialCodeRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new MaterialCodeController();

      server.route([
        {
          method: "POST",
          path: "/api/material-code/create",
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create material code",
            tags: ["api", "Material code"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.get,
              },
            },
          },
        },
        {
          method: "GET",
          path: "/api/material-code/get-one/{id}",
          options: {
            handler: controller.get,
            validate: commonValidate.getOne,
            description: "Method that create material code",
            tags: ["api", "Material code"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.get,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_MATERIAL_CODE_GROUP,
          options: {
            handler: controller.getMaterialCodeGroup,
            validate: validate.getWithDesignId,
            description: "Method that get list material code group",
            tags: ["api", "Material code"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getMaterialCodeGroup,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_CODE_MATERIAL_CODE,
          options: {
            handler: controller.getListCodeMaterialCode,
            // validate: validate.getWithDesignId,
            description: "Method that get list code of material code",
            tags: ["api", "Material code"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                // 200: ProductResponse.getMaterialCodeGroup,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
