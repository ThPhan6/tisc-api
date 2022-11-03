import * as Hapi from "@hapi/hapi";
import UserController from "./user.controller";
import validate from "./user.validate";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { AUTH_NAMES, imageOptionPayload, ROUTES } from "@/constants";
import response from "./user.response";
import { getListValidation } from "@/validate/common.validate";

export default class UserRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_TEAM_PROFILE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create an user",
            tags: ["api", "Team profile"],
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
          path: ROUTES.GET_ME_TEAM_PROFILE,
          options: {
            handler: controller.getMe,
            description: "Method that get current user",
            tags: ["api", "User profile"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                // 200: response.getOne,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_TEAM_PROFILE,
          options: {
            handler: controller.getList,
            validate: getListValidation(),
            description: "Method that get list user",
            tags: ["api", "Team profile"],
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
          path: ROUTES.GET_ONE_TEAM_PROFILE,
          options: {
            handler: controller.get,
            validate: validate.getOne,
            description: "Method that get one user",
            tags: ["api", "Team profile"],
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
          method: "POST",
          path: ROUTES.UPDATE_ME_TEAM_PROFILE,
          options: {
            handler: controller.updateMe,
            validate: validate.updateMe,
            description: "Method that update current user profile",
            tags: ["api", "User profile"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.EDIT_TEAM_PROFILE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update user profile",
            tags: ["api", "Team profile"],
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
          method: "POST",
          path: ROUTES.UPDATE_AVATAR_TEAM_PROFILE,
          options: {
            handler: controller.updateAvatar,
            validate: validate.updateAvatar,
            description: "Method that update user avatar",
            tags: ["api", "User profile"],
            auth: AUTH_NAMES.GENERAL,
            payload: imageOptionPayload,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.avatar,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.SEND_INVITE_TEAM_PROFILE,
          options: {
            handler: controller.invite,
            validate: validate.getOne,
            description: "Method that invite team profile",
            tags: ["api", "Team profile"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_TEAM_PROFILE,
          options: {
            handler: controller.delete,
            validate: validate.getOne,
            description: "Method that delete team profile",
            tags: ["api", "Team profile"],
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
          path: "/api/user/get-interested-options",
          options: {
            handler: controller.getInterestedOptions,
            description: "Method that get interested options",
            tags: ["api", "User profile"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getInterestedOptions,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_BRAND_TEAM_GROUP_BY_COUNTRY,
          options: {
            handler: controller.getBrandTeamGroupByCountry,
            validate: validate.getWithBrandId,
            description: "Method that get list brand team group by country",
            tags: ["api", "Team profile"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getTeamGroupByCountry,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_DESIGN_TEAM_GROUP_BY_COUNTRY,
          options: {
            handler: controller.getDesignTeamGroupByCountry,
            validate: validate.getWithDesignId,
            description: "Method that get list design team group by country",
            tags: ["api", "Team profile"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getTeamGroupByCountry,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_TISC_TEAM_PROFILE,
          options: {
            handler: controller.getTiscTeamsProfile,
            validate: validate.getWithBrandId,
            description: "Method that get TISC teams profile",
            tags: ["api", "Team profile"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getTiscTeamsProfile,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.ASSIGN_TEAM,
          options: {
            handler: controller.assignTeam,
            validate: validate.assignTeam,
            description: "Method that assign team",
            tags: ["api", "Team profile"],
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
