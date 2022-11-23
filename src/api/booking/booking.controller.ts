import { Request, ResponseToolkit } from "@hapi/hapi";
import { bookingService } from "./booking.service";
import { BookingPayloadRequest, ReScheduleBookingPayloadRequest } from "./booking.type";

export default class BookingController {
  public availableSchedule = async (req: Request, toolkit: ResponseToolkit) => {
    const {date} = req.query;
    const response = await bookingService.availableSchedule(date);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: BookingPayloadRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await bookingService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public reSchedule = async (
    req: Request & {payload: ReScheduleBookingPayloadRequest},
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const {id} = req.params;
    const response = await bookingService.reSchedule(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const {id} = req.params;
    const response = await bookingService.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public cancel = async (req: Request, toolkit: ResponseToolkit) => {
    const {id} = req.params;
    const response = await bookingService.cancel(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
