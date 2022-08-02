import * as Hapi from "@hapi/hapi";
import SpecifiedProductController from "./specified_product.controller";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import response from "./specified_product.response";
import validate from "./specified_product.validate";
import { ROUTES } from "../../constant/api.constant";

export default class SpecifiedProductRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new SpecifiedProductController();

      server.route([
        {
          method: "POST",
          path: ROUTES.SPECIFY_PRODUCT,
          options: {
            handler: controller.specify,
            validate: validate.specify,
            description: "Method that specify considered product",
            tags: ["api", "Specified Product"],
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
          path: ROUTES.GET_ONE_SPECIFIED_PRODUCT,
          options: {
            handler: controller.get,
            validate: validate.getOne,
            description: "Method that get one specified product",
            tags: ["api", "Specified Product"],
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
          path: ROUTES.GET_REQUIREMENT_TYPES,
          options: {
            handler: controller.getRequirementTypes,
            description: "Method that get list requirement types",
            tags: ["api", "Specified Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListRequirementType,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_INSTRUCTION_TYPES,
          options: {
            handler: controller.getInstructionTypes,
            description: "Method that get list instruction types",
            tags: ["api", "Specified Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListInstructionType,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_UNIT_TYPES,
          options: {
            handler: controller.getUnitTypes,
            description: "Method that get list unit types",
            tags: ["api", "Specified Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListUnitType,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
