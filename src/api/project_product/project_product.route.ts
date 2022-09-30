import * as Hapi from "@hapi/hapi";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { ROUTES } from "@/constant/api.constant";
import { AUTH_NAMES } from "@/constant/auth.constant";
import ProjectProductController from "./project_product.controller";
import validate from "./project_product.validate";
import consideredProductResponse from "../considered_product/considered_product.response";

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
            validate: validate.getProjectAssignZoneByProduct,
            description: "Method that get list assigned by project and product",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: consideredProductResponse.getListAssignedProject,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_CONSIDERED_PRODUCT_LIST,
          options: {
            handler: controller.getConsideredProducts,
            validate: validate.getConsideredProducts,
            description: "Method that get considered product list",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: consideredProductResponse.getList,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.UPDATE_CONSIDERED_PRODUCT_STATUS,
          options: {
            handler: controller.updateConsiderProduct,
            validate: validate.updateConsiderProductStatus,
            description: "Method that update considered product",
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
          method: "DELETE",
          path: ROUTES.DELETE_CONSIDERED_PRODUCT,
          options: {
            handler: controller.deleteConsiderProduct,
            validate: validate.deleteConsiderProduct,
            description: "Method that delete considered product",
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
          method: "PATCH",
          path: ROUTES.UPDATE_SPECIFIED_PRODUCT_STATUS,
          options: {
            handler: controller.specifyProduct,
            validate: validate.updateProductSpecifyStatus,
            description: "Method that update specified product status",
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
          method: "PATCH",
          path: ROUTES.UPDATE_CONSIDERED_PRODUCT_SPECIFY,
          options: {
            handler: controller.specifyProduct,
            validate: validate.specifyProduct,
            description:
              "Method that update considered product specified information",
            tags: ["api", "Project"],
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
