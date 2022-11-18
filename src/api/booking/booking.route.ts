import {
  defaultRouteOptionResponseStatus, generalMessageResponse,
} from "@/helper/response.helper";
import { ROUTES } from "@/constants";
import * as Hapi from "@hapi/hapi";
import IRoute from "@/helper/route.helper";
import validate from "./booking.validate";
import BookingController from "./booking.controller";
import response from "./booking.response";

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
                200: response.availableSchedule
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
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse
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
                200: generalMessageResponse
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.BOOKING.CANCEL,
          options: {
            handler: controller.cancel,
            validate: validate.cancel,
            description: "Method that delete booking",
            tags: ["api", "Booking"],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse
              },
            },
          },
        }
      ]);
      resolve(true);
    });
  }
}