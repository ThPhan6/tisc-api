import * as Hapi from "@hapi/hapi";
import { ROUTES, AUTH_NAMES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import ContactController from "./contact.controller";
import validate from "./contact.validate";
import contactResponse from "./contact.response";

export default class ContactRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ContactController();
      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_CONTACT,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create contact",
            tags: ["api", "Contact"],
            auth: AUTH_NAMES.CAPTCHA,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: contactResponse.contact,
              },
            },
          },
        },
        // {
        //   method: "GET",
        //   path: ROUTES.GET_LIST_CONTACT,
        //   options: {
        //     handler: controller.getList,
        //     validate: commonValidate.getList,
        //     description: "Method that get list contact",
        //     tags: ["api", "Contact"],
        //     auth: false,
        //     response: {
        //       status: {
        //         ...defaultRouteOptionResponseStatus,
        //         200: contactResponse.contacts,
        //       },
        //     },
        //   },
        // },
        // {
        //   method: "GET",
        //   path: ROUTES.GET_ONE_CONTACT,
        //   options: {
        //     handler: controller.getById,
        //     validate: validate.getById,
        //     description: "Method that get one contact",
        //     tags: ["api", "Contact"],
        //     auth: false,
        //     response: {
        //       status: {
        //         ...defaultRouteOptionResponseStatus,
        //         200: contactResponse.contact,
        //       },
        //     },
        //   },
        // },
      ]);
      resolve(true);
    });
  }
}
