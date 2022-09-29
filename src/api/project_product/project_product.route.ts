import * as Hapi from "@hapi/hapi";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { ROUTES } from "@/constant/api.constant";
import { AUTH_NAMES } from "@/constant/auth.constant";
import ProjectProductController from "./project_product.controller";
import validate from "./project_product.validate";

export default class ProjectProductRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProjectProductController();

      server.route([
        {
          method: "POST",
          path: ROUTES.ASSIGN_PRODUCT_TO_A_PROJECT,
          options: {
            handler: controller.assignProductToProject,
            validate: validate.assignProductToProject,
            description: "Method that assign product to project",
            tags: ["api", "Project"],
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
          path: ROUTES.GET_PROJECT_ASSIGN_ZONE_BY_PRODUCT,
          options: {
            handler: controller.getProjectAssignZoneByProduct,
            // validate: validate.getListAssignedProject,
            description: "Method that get list assigned by project and product",
            tags: ["api", "Considered Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                // 200: ProductResponse.getListAssignedProject,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
