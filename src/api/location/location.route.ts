import * as Hapi from "@hapi/hapi";
import LocationController from "./location.controller";
import { getOneValidation } from "@/validate/common.validate";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import response from "./location.response";
import validate from "./location.validate";
import { AUTH_NAMES, ROUTES } from "@/constants";

export default class LocationRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new LocationController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_LOCATION,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create location",
            tags: ["api", "Location"],
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
          path: ROUTES.EDIT_LOCATION,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update location",
            tags: ["api", "Location"],
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
          path: ROUTES.GET_ONE_LOCATION,
          options: {
            handler: controller.get,
            validate: getOneValidation,
            description: "Method that get one location",
            tags: ["api", "Location"],
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
          path: ROUTES.GET_LIST_LOCATION,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list location",
            tags: ["api", "Location"],
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
          path: ROUTES.GET_LIST_LOCATION_WITH_GROUP,
          options: {
            handler: controller.getListWithGroup,
            description: "Method that get list location with group",
            tags: ["api", "Location"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListWithGroup,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_MARKET_LOCATIONS_COUNTRY_GROUP,
          options: {
            handler: controller.getMarketLocationGroupByCountry,
            validate: validate.getMarketLocationsCountryGroup,
            description:
              "Method that get market availability locations group by country",
            tags: ["api", "Location"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListWithGroup,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
          options: {
            handler: controller.getCompanyLocationGroupByCountry,
            validate: validate.getBrandLocationsCountryGroup,
            description: "Method that get brand locations group by country",
            tags: ["api", "Location"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListWithGroup,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_DESIGN_LOCATIONS_COUNTRY_GROUP,
          options: {
            handler: controller.getCompanyLocationGroupByCountry,
            validate: validate.getDesignLocationsCountryGroup,
            description: "Method that get design locations group by country",
            tags: ["api", "Location"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListWithGroup,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_LOCATION,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete location",
            tags: ["api", "Location"],
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
