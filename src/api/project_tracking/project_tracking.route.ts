import * as Hapi from "@hapi/hapi";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { ROUTES } from "@/constant/api.constant";
import { AUTH_NAMES } from "@/constant/auth.constant";
import ProjectTrackingController from "./project_tracking.controller";
import validate from "./project_tracking.validate";
import response from "./project_tracking.response";

export default class ProjectTrackingRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProjectTrackingController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_PRODUCT_REQUEST,
          options: {
            handler: controller.createProjectRequest,
            validate: validate.createProjectRequest,
            description: "Method that create a product request for a project",
            tags: ["api", "Project Tracking"],
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
          path: ROUTES.GET_LIST_PROJECT_TRACKING,
          options: {
            handler: controller.getListProjectTracking,
            validate: validate.getList,
            description: "Method that create project tracking list",
            tags: ["api", "Project Tracking"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListProjectTracking,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.UPDATE_PROJECT_TRACKING,
          options: {
            handler: controller.updateProjectTracking,
            validate: validate.updateProjectTracking,
            description: "Method that update project tracking info",
            tags: ["api", "Project Tracking"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_PROJECT_TRACKING_SUMMARY,
          options: {
            handler: controller.getProjectTrackingSummary,
            description: "Method that get project tracking summary info",
            tags: ["api", "Project Tracking"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                // 200: response.getProjectTrackingSummary,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
