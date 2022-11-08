import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import { Server } from "@hapi/hapi";
import CustomLibraryController from "./custom_library.controller";
// import response from "./custom_library.response";
import validate from "./custom_library.validate";

export default class ActionTaskRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CustomLibraryController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CUSTOM_LIBRARY.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create Custom Library",
            tags: ["api", "Action Task"],
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
