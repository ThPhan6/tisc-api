import * as Hapi from "@hapi/hapi";
import IRoute from "@/helpers/route.helper";
import validate from "./color.validate";
import { ROUTES } from "@/constants";
import { colorController } from "./color.controller";

export default class ProductRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      server.route([
        {
          method: "POST",
          path: ROUTES.DETECT_COLOR,
          options: {
            handler: colorController.detectColor,
            validate: validate.detectColor,
            description: "Method that detect color of images",
            tags: ["api", "Color"],
            auth: false,
            // response: {
            //   status: {
            //     ...defaultRouteOptionResponseStatus,
            //   },
            // },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_COLOR_COLLECTION,
          options: {
            handler: colorController.getColorCollection,
            validate: validate.getColorCollection,
            description: "Method that recommend color collection",
            tags: ["api", "Color"],
            auth: false,
            // response: {
            //   status: {
            //     ...defaultRouteOptionResponseStatus,
            //   },
            // },
          },
        },
      ]);

      resolve(true);
    });
  }
}
