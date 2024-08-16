import * as Hapi from "@hapi/hapi";
import IRoute from "@/helpers/route.helper";
import PartnerController from "@/api/partner/partner.controller";
import { AUTH_NAMES, ROUTES } from "@/constants";
import validate from "@/api/partner/partner.validate";
import { defaultRouteOptionResponseStatus } from "@/helpers/response.helper";
import response from "@/api/partner/partner.response";

export default class PartnerRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise<any>((resolve) => {
      const controller = new PartnerController();

      server.route([
        {
          method: "POST",
          path: ROUTES.PARTNER.CREATE_PARTNER,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create a partner",
            tags: ["api", "Partner"],
            auth: AUTH_NAMES.GENERAL,
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
