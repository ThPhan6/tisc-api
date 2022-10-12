import IRoute from "@/helper/route.helper";
import * as Hapi from "@hapi/hapi";
import { AUTH_NAMES, ROUTES } from "@/constants";
import validate from "./general_inquiry.validate";
import response from "./general_inquiry.response";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import GeneralInquiryController from "./general_inquiry.controller";
export default class GeneralInquiryRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new GeneralInquiryController();
      server.route([
        {
          method: "POST",
          path: ROUTES.GENERAL_INQUIRY.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create general inquiry",
            tags: ["api", "General Inquiry"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.create,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GENERAL_INQUIRY.GET_LIST,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list general inquiry",
            tags: ["api", "General Inquiry"],
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
          path: ROUTES.GENERAL_INQUIRY.SUMMARY,
          options: {
            handler: controller.getSummary,
            description: "Method that get summary general inquiry",
            tags: ["api", "General Inquiry"],
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
          path: ROUTES.GENERAL_INQUIRY.GET_ONE,
          options: {
            handler: controller.getOne,
            validate: validate.getOne,
            description: "Method that get general inquiry detail",
            tags: ["api", "General Inquiry"],
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
