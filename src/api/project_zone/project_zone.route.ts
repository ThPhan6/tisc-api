import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { AUTH_NAMES } from "@/constants";
import validate from "./project_zone.validate";
import response from "./project_zone.response";
import ProjectZoneController from "./project_zone.controller";
import { getOneValidation } from "@/validate/common.validate";
import { ROUTES } from "@/constants";

export default class ProjectZoneRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProjectZoneController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_PROJECT_ZONE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create project zone",
            tags: ["api", "Project zone"],
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
          path: ROUTES.GET_LIST_PROJECT_ZONE,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list project zone",
            tags: ["api", "Project zone"],
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
          path: ROUTES.GET_ONE_PROJECT_ZONE,
          options: {
            handler: controller.getOne,
            validate: getOneValidation,
            description: "Method that get one project zone",
            tags: ["api", "Project zone"],
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
          path: ROUTES.UPDATE_PROJECT_ZONE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update project zone",
            tags: ["api", "Project zone"],
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
          path: ROUTES.DELETE_PROJECT_ZONE,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete project zone",
            tags: ["api", "Project zone"],
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
