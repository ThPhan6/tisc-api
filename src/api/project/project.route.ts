import { generalMessageResponse } from "./../../helper/response.helper";
import * as Hapi from "@hapi/hapi";
import commonValidate from "../../validate/common.validate";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import validate from "./project.validate";
import response from "./project.response";
import ProjectController from "./project.controller";
export default class ProjectRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProjectController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_PROJECT,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create project",
            tags: ["api", "Project"],
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
          path: ROUTES.GET_ONE_PROJECT,
          options: {
            handler: controller.getOne,
            validate: commonValidate.getOne,
            description: "Method that get one project",
            tags: ["api", "Project"],
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
          path: ROUTES.GET_PROJECT_TYPES,
          options: {
            handler: controller.getProjectTypes,
            description: "Method that get project types",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getlistType,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_BUILDING_TYPES,
          options: {
            handler: controller.getBuildingTypes,
            description: "Method that get building types",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getlistType,
              },
            },
          },
        },
        {
          method: "GET",
          path: "/api/project/measurement-units",
          options: {
            handler: controller.getMeasurementUnits,
            description: "Method that get measurement units",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getMeasurementUnitOptions,
              },
            },
          },
        },
        {
          method: "GET",
          path: "/api/project/status",
          options: {
            handler: controller.getProjectStatus,
            description: "Method that get project status",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getMeasurementUnitOptions,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_PROJECT,
          options: {
            handler: controller.getList,
            validate: commonValidate.getList,
            description: "Method that get list project",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getList,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
