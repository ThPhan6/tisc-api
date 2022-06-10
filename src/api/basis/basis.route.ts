import {
  generalMessageResponse,
  defaultRouteOptionResponseStatus,
} from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import * as Hapi from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import IRoute from "../../helper/route.helper";
import commonValidate from "../../validate/common.validate";
import BasisController from "./basis.controller";
import validate from "./basis.validate";
import response from "./basis.response";
export default class BasisRoute implements IRoute {
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
            tags: ["api", "Basis conversion"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisConversion,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_BASIS_CONVERSION,
          options: {
            handler: controller.getBasisConversions,
            validate: validate.getListBasisConversion,
            description: "Method that get basis conversions",
            tags: ["api", "Basis conversion"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisConversions,
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
            tags: ["api", "Basis conversion"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisConversion,
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
            tags: ["api", "Basis conversion"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisConversion,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_BASIS_CONVERSION,
          options: {
            handler: controller.deleteBasis,
            validate: commonValidate.getOne,
            description: "Method that delete basis conversion",
            tags: ["api", "Basis conversion"],
            // auth: AUTH_NAMES.PERMISSION,
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
          path: ROUTES.CREATE_BASIS_OPTION,
          options: {
            handler: controller.createBasisOption,
            validate: validate.createBasisOption,
            description: "Method that create basis option",
            tags: ["api", "Basis option"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisOption,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_BASIS_OPTION,
          options: {
            handler: controller.getBasisOption,
            validate: commonValidate.getOne,
            description: "Method that get one basis option",
            tags: ["api", "Basis option"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisOption,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_BASIS_OPTION,
          options: {
            handler: controller.getListBasisOption,
            validate: validate.getListBasisOption,
            description: "Method that get list basis option",
            tags: ["api", "Basis option"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basesOption,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_BASIS_OPTION,
          options: {
            handler: controller.updateBasisOption,
            validate: validate.updateBasisOption,
            description: "Method that update basis option",
            tags: ["api", "Basis option"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisOption,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_BASIS_OPTION,
          options: {
            handler: controller.deleteBasis,
            validate: commonValidate.getOne,
            description: "Method that delete basis option",
            tags: ["api", "Basis option"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.CREATE_BASIS_PRESET,
          options: {
            handler: controller.createBasisPreset,
            validate: validate.createBasisPreset,
            description: "Method that create basis preset",
            tags: ["api", "Basis preset"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisPreset,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_BASIS_PRESET,
          options: {
            handler: controller.getBasisPreset,
            validate: commonValidate.getOne,
            description: "Method that get one basis preset",
            tags: ["api", "Basis preset"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisPreset,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_BASIS_PRESET,
          options: {
            handler: controller.getListBasisPreset,
            validate: validate.getListBasisPreset,
            description: "Method that get list basis preset",
            tags: ["api", "Basis preset"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisPresets,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_BASIS_PRESET,
          options: {
            handler: controller.updateBasisPreset,
            validate: validate.updateBasisPreset,
            description: "Method that update basis preset",
            tags: ["api", "Basis preset"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.basisPreset,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_BASIS_PRESET,
          options: {
            handler: controller.createBasisConversion,
            validate: commonValidate.getOne,
            description: "Method that delete basis preset",
            tags: ["api", "Basis preset"],
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
