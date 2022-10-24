import * as Hapi from "@hapi/hapi";
import DesignerController from "./designer.controller";
import commonValidate from "@/validate/common.validate";
import IRoute from "@/helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  statuses,
} from "@/helper/response.helper";
import { AUTH_NAMES } from "@/constant/auth.constant";
import response from "./designer.response";
import validate from "./designer.validate";
import { ROUTES } from "@/constants";

export default class DesignerRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new DesignerController();

      server.route([
        {
          method: "GET",
          path: ROUTES.DESIGN_FIRM.GET_LIST_DESIGN_FIRM,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list design firm",
            tags: ["api", "Designer"],
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
          path: ROUTES.DESIGN_FIRM.GET_ONE_DESIGN_FIRM,
          options: {
            handler: controller.getOne,
            validate: commonValidate.getOne,
            description: "Method that get one design firm",
            tags: ["api", "Designer"],
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
          path: ROUTES.DESIGN_FIRM.GET_DESIGN_STATUSES,
          options: {
            handler: controller.getStatuses,
            description: "Method that get designer statuses",
            tags: ["api", "Designer"],
            response: {
              status: {
                200: statuses,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.DESIGN_FIRM.GET_ALL_DESIGN_FIRM_SUMMARY,
          options: {
            handler: controller.getAllDesignSummary,
            description: "Method that get all design summary",
            tags: ["api", "Designer"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAllDesignSummary,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.DESIGN_FIRM.UPDATE_DESIGN_STATUS,
          options: {
            handler: controller.updateDesign,
            validate: validate.updateDesignStatus,
            description: "Method that update design status",
            tags: ["api", "Designer"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.DESIGN_FIRM.UPDATE_DESIGN_FIRM,
          options: {
            handler: controller.updateDesign,
            validate: validate.updateDesign,
            description: "Method that update design office profile",
            tags: ["api", "Designer"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
