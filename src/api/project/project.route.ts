import * as Hapi from "@hapi/hapi";
import {
  getListValidation,
  getOneValidation,
} from "@/validate/common.validate";
import IRoute from "@/helper/route.helper";
import {
  commonResponse,
  defaultRouteOptionResponseStatus,
} from "@/helper/response.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
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
            validate: getOneValidation,
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
          path: ROUTES.GET_ALL_PROJECT,
          options: {
            handler: controller.getAll,
            description: "Method that get all project",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAll,
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
                200: commonResponse.keyValueResponse,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_PROJECT,
          options: {
            handler: controller.getList,
            validate: getListValidation(),
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
        {
          method: "PUT",
          path: ROUTES.UPDATE_PROJECT,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update project",
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
          method: "DELETE",
          path: ROUTES.DELETE_PROJECT,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete project",
            tags: ["api", "Project"],
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
          path: ROUTES.GET_PROJECT_SUMMARY,
          options: {
            handler: controller.getProjectSummary,
            description: "Method that get project summary",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getSummary,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_PROJECT_SUMMARY_OVERALL,
          options: {
            handler: controller.getProjectOverallSummary,
            description: "Method that get project overall summary",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getSummaryOverall,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_PROJECT_LISTING,
          options: {
            validate: validate.getProjectListing,
            handler: controller.getProjectListing,
            description: "Method that get project listing",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getProjectListing,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_PROJECT_LISTING,
          options: {
            validate: validate.getOneProjectListing,
            handler: controller.getProjectListingDetail,
            description: "Method that get project listing detail",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getProjectListingDetail,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_PROJECT_GROUP_BY_STATUS,
          options: {
            handler: controller.getProjectGroupByStatus,
            validate: validate.getWithDesignId,
            description: "Method that get list project group by status",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getProjectGroupByStatus,
              },
            },
          },
        },

        {
          method: "PATCH",
          path: ROUTES.ASSIGN_TEAM_PROJECT,
          options: {
            handler: controller.partialUpdate,
            validate: validate.assignTeamProject,
            description: "Method that assign team to project",
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
      ]);

      resolve(true);
    });
  }
}
