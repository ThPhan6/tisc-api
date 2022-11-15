import * as Hapi from "@hapi/hapi";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
import ProjectProductController from "./project_product.controller";
import validate from "./project_product.validate";
import response from "./project_product.response";

export default class ProjectProductRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProjectProductController();

      server.route([
        {
          method: "POST",
          path: ROUTES.PROJECT_PRODUCT.ASSIGN_PRODUCT_TO_A_PROJECT,
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
          path: ROUTES.PROJECT_PRODUCT.GET_PROJECT_ASSIGN_ZONE_BY_PRODUCT,
          options: {
            handler: controller.getProjectAssignZoneByProduct,
            validate: validate.getProjectAssignZoneByProduct,
            description: "Method that get list assigned by project and product",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListAssignedProject,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.PROJECT_PRODUCT.GET_CONSIDERED_PRODUCT_LIST,
          options: {
            handler: controller.getConsideredProducts,
            validate: validate.getConsideredProducts,
            description: "Method that get considered product list",
            tags: ["api", "Project"],
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
          method: "PATCH",
          path: ROUTES.PROJECT_PRODUCT.UPDATE_CONSIDERED_PRODUCT_STATUS,
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
          path: ROUTES.PROJECT_PRODUCT.DELETE_CONSIDERED_PRODUCT,
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
          path: ROUTES.PROJECT_PRODUCT.UPDATE_SPECIFIED_PRODUCT_STATUS,
          options: {
            handler: controller.updateSpecifyProductStatus,
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
          path: ROUTES.PROJECT_PRODUCT.UPDATE_CONSIDERED_PRODUCT_SPECIFY,
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
        {
          method: "GET",
          path: ROUTES.PROJECT_PRODUCT.GET_SPECIFYING_PRODUCTS_BY_BRAND,
          options: {
            handler: controller.getSpecifiedProductsByBrand,
            validate: validate.getListByBrand,
            description: "Method that get specified products group by brand",
            tags: ["api", "Project"],
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
          path: ROUTES.PROJECT_PRODUCT.GET_SPECIFYING_PRODUCTS_BY_MATERIAL,
          options: {
            handler: controller.getSpecifiedProductsByMaterial,
            validate: validate.getListByMaterial,
            description: "Method that get specified products group by material",
            tags: ["api", "Project"],
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
          path: ROUTES.PROJECT_PRODUCT.GET_SPECIFYING_PRODUCTS_BY_ZONE,
          options: {
            handler: controller.getSpecifiedProductsByZone,
            validate: validate.getConsideredProducts,
            description: "Method that get specified products group by space",
            tags: ["api", "Project"],
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
          path: ROUTES.PROJECT_PRODUCT.GET_LIST_FINISH_SCHEDULE_FOR,
          options: {
            handler: controller.getFinishScheduleByRoom,
            validate: validate.getFinishScheduleByRoom,
            description: "Method that get list finish schedules each Room",
            tags: ["api", "Project"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getFinishScheduleByRoom,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
