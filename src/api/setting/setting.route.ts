import * as Hapi from "@hapi/hapi";
import SettingController from "./setting.controller";
import IRoute from "@/helpers/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helpers/response.helper";
import response from "./setting.response";
import validate from "./setting.validate";
import { AUTH_NAMES, ROUTES } from "@/constants";

export default class SettingRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new SettingController();

      server.route([
        {
          method: "GET",
          path: ROUTES.SETTING.COUNTRY_REGION_GROUP,
          options: {
            handler: controller.getAllCountryWithRegionGroup,
            description: "Method that get all country with region group",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListRegion,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.COMMON_TYPES_LIST,
          options: {
            handler: controller.getCommonTypes,
            validate: validate.getCommonTypes,
            description: "Method that get commontyes types",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.commonList,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.GET_COUNTRIES,
          options: {
            handler: controller.getCountries,
            description: "Method that get all country",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.countries,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.GET_STATES,
          options: {
            handler: controller.getStates,
            validate: validate.getStates,
            description: "Method that get country states",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.states,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.GET_CITIES,
          options: {
            handler: controller.getCities,
            validate: validate.getCities,
            description: "Method that get cities",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.cities,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.FIND_COUNTRY,
          options: {
            handler: controller.findCountry,
            validate: validate.findById,
            description: "Method that get country detail",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.country,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.FIND_STATE,
          options: {
            handler: controller.findState,
            validate: validate.findById,
            description: "Method that get state detail",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.state,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.FIND_CITY,
          options: {
            handler: controller.findCity,
            validate: validate.findById,
            description: "Method that get city detail",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.city,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.GET_MEASUREMENT_UNIT,
          options: {
            handler: controller.getMeasurementUnits,
            description: "Method that get measurement units",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.responseIdIsNumber,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.GET_FUNCTIONAL_TYPE,
          options: {
            handler: controller.getFunctionalType,
            description: "Method that get functional type",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.responseIdIsNumber,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SETTING.GET_DEFAULT_DIMENSION_AND_WEIGHT,
          options: {
            handler: controller.getDimensionAndWeight,
            description: "Method that get Dimension And Weight",
            tags: ["api", "Setting"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.dimensionAndWeight,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
