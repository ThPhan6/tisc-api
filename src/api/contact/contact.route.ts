import { generalMessageResponse } from "./../../helper/response.helper";
import * as Hapi from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import IRoute from "../../helper/route.helper";
import ContactController from "./contact.controller";
import validate from "./contact.validate";

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
            description: "Method that create contact form",
            tags: ["api", "Contact"],
            auth: false,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
