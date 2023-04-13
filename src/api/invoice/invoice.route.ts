import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helpers/response.helper";
import IRoute from "@/helpers/route.helper";
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
                200: response.getOne,
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
        {
          method: "POST",
          path: ROUTES.INVOICE.SEND_REMINDER,
          options: {
            handler: controller.sendReminder,
            description: "Method that send reminder email",
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
          method: "POST",
          path: ROUTES.INVOICE.BILL,
          options: {
            handler: controller.bill,
            validate: validate.get,
            description: "Method that bill invoice",
            tags: ["api", "Invoice"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.INVOICE.PAID,
          options: {
            handler: controller.paid,
            validate: validate.get,
            description: "Method that mark invoice as paid",
            tags: ["api", "Invoice"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.INVOICE.DELETE,
          options: {
            handler: controller.delete,
            validate: validate.get,
            description: "Method that delete invoice",
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
          path: ROUTES.INVOICE.GET_INVOICE_PDF,
          options: {
            handler: controller.getInvoicePdf,
            validate: validate.get,
            description: "Method that get invoice pdf",
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
          method: "POST",
          path: "/api/invoice/{id}/intent",
          options: {
            handler: controller.createPaymentIntent,
            validate: validate.get,
            description: "Method that create payment intent",
            tags: ["api", "Invoice"],
            auth: AUTH_NAMES.GENERAL,
          },
        },
        {
          method: "POST",
          path: "/api/invoice/payment-webhook",
          options: {
            handler: controller.receivePaymentInfo,
            description: "Method that receive payment info",
            tags: ["api", "Invoice"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
