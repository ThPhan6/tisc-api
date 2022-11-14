import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import { Server } from "@hapi/hapi";
import InvoiceController from "./invoice.controller";
import response from "./invoice.response";
import validate from "./invoice.validate";
export default class InvoiceRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new InvoiceController();

      server.route([
        {
          method: "POST",
          path: ROUTES.INVOICE.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create invoice",
            tags: ["api", "Invoice"],
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
          path: ROUTES.INVOICE.UPDATE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update status invoice",
            tags: ["api", "Invoice"],
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
          path: ROUTES.INVOICE.GET,
          options: {
            handler: controller.get,
            validate: validate.get,
            description: "Method that get invoice",
            tags: ["api", "Invoice"],
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
          path: ROUTES.INVOICE.GET_LIST,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list invoice",
            tags: ["api", "Invoice"],
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
          path: ROUTES.INVOICE.GET_SUMMARY,
          options: {
            handler: controller.getInvoiceSummary,
            description: "Method that get invoice summary",
            tags: ["api", "Invoice"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getSummary,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
