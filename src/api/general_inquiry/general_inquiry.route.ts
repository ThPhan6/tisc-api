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
