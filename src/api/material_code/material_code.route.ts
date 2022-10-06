import * as Hapi from "@hapi/hapi";
import MaterialCodeController from "./material_code.controller";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { AUTH_NAMES } from "@/constant/auth.constant";
import ProductResponse from "./material_code.response";
import validate from "./material_code.validate";
import commonValidate from "@/validate/common.validate";
import { ROUTES } from "@/constants";

export default class MaterialCodeRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new MaterialCodeController();

      server.route([
        {
          method: "POST",
          path: ROUTES.MATERIAL_CODE.CREATE_MATERIAL_CODE,
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
          path: ROUTES.MATERIAL_CODE.GET_MATERIAL_CODE,
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
          path: ROUTES.MATERIAL_CODE.GET_MATERIAL_CODES,
          options: {
            handler: controller.getMaterialCodes,
            validate: validate.getWithDesignId,
            description: "Method that get list material code",
            tags: ["api", "Material code"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getMaterialCodes,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.MATERIAL_CODE.GET_LIST_CODE_MATERIAL_CODE,
          options: {
            handler: controller.getListCodeMaterialCode,
            description: "Method that get list code of material code",
            tags: ["api", "Material code"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getListCodeMaterialCode,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.MATERIAL_CODE.UPDATE_MATERIAL_CODE,
          options: {
            validate: validate.update,
            handler: controller.update,
            description: "Method that update material code",
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
          method: "DELETE",
          path: ROUTES.MATERIAL_CODE.DELETE_MATERIAL_CODE,
          options: {
            validate: commonValidate.getOne,
            handler: controller.delete,
            description: "Method that delete material code",
            tags: ["api", "Material code"],
            auth: AUTH_NAMES.PERMISSION,
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
