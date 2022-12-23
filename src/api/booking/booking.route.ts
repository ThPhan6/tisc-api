import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "@/helper/response.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
import * as Hapi from "@hapi/hapi";
import IRoute from "@/helper/route.helper";
import validate from "./booking.validate";
import BookingController from "./booking.controller";
import response from "./booking.response";
import { getOneValidation } from "@/validate/common.validate";
import { preventAttempt } from "@/middleware/prevent_attempt.middleware";

export default class BookingRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new BookingController();

      server.route([
        {
          method: "GET",
          path: ROUTES.BOOKING.AVAILABLE_SCHEDULE,
          options: {
            handler: controller.availableSchedule,
            validate: validate.availableSchedule,
            description: "Method that get available time",
            tags: ["api", "Booking"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.availableSchedule,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.BOOKING.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that post booking",
            tags: ["api", "Booking"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.create,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.BOOKING.GET_ONE,
          options: {
            handler: controller.getOne,
            validate: getOneValidation,
            description: "Method that post booking",
            tags: ["api", "Booking"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.BOOKING.RE_SCHEDULE,
          options: {
            handler: controller.reSchedule,
            validate: validate.reSchedule,
            description: "Method that patch reschedule booking",
            tags: ["api", "Booking"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.BOOKING.CANCEL,
          options: {
            handler: controller.cancel,
            validate: getOneValidation,
            description: "Method that delete booking",
            tags: ["api", "Booking"],
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
