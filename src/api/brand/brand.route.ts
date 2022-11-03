import * as Hapi from "@hapi/hapi";
import BrandController from "./brand.controller";
import { getAllValidation, getOneValidation } from "@/validate/common.validate";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  statuses,
} from "../../helper/response.helper";
import { AUTH_NAMES } from "@/constants";
import response from "./brand.response";
import validate from "./brand.validate";
import Joi from "joi";
import { imageOptionPayload, ROUTES } from "@/constants";

export default class BrandRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new BrandController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_BRAND,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list brand",
            tags: ["api", "Brand"],
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
          path: ROUTES.GET_ALL_BRAND_SUMMARY,
          options: {
            handler: controller.getAllBrandSummary,
            description: "Method that get all brand summary",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAllBrandSummary,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_BRAND_CARD,
          options: {
            handler: controller.getListCard,
            validate: getAllValidation(),
            description: "Method that get list brand card",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getBrandCards,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_BRAND_BY_ALPHABET,
          options: {
            handler: controller.getAllByAlphabet,
            description: "Method that get list brand by alphabet",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAllByAlphabet,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_BRAND,
          options: {
            handler: controller.getOne,
            validate: getOneValidation,
            description: "Method that get one brand",
            tags: ["api", "Brand"],
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
          path: ROUTES.SEND_EMAIL_INVITE_BRAND,
          options: {
            handler: controller.invite,
            validate: getOneValidation,
            description: "Method that invite brand",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.CREATE_BRAND,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create brand",
            tags: ["api", "Brand"],
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
          path: ROUTES.GET_BRAND_STATUSES,
          options: {
            handler: controller.getBrandStatuses,
            description: "Method that get brand statuses",
            tags: ["api", "Brand"],
            response: {
              status: {
                200: statuses,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.UPDATE_BRAND_PROFILE,
          options: {
            handler: controller.updateBrandProfile,
            validate: validate.updateBrandProfile,
            description: "Method that update brand profile",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.brandProfile,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.UPDATE_BRAND_LOGO,
          options: {
            handler: controller.updateBrandLogo,
            validate: {
              payload: {
                logo: Joi.any(),
              },
            },
            description: "Method that update brand logo",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            payload: imageOptionPayload,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.logo,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.UPDATE_BRAND_STATUS,
          options: {
            handler: controller.updateBrandStatus,
            validate: validate.updateBrandStatus,
            description: "Method that update brand status",
            tags: ["api", "Brand"],
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
