import { Request, ResponseToolkit } from "@hapi/hapi";
import { bookingService } from "./booking.service";
import { IBookingRequest, IReScheduleBookingRequest } from "./booking.type";

export default class BookingController {
  public availableSchedule = async (req: Request, toolkit: ResponseToolkit) => {
    const {timezone, date} = req.query;
    const response = await bookingService.availableSchedule(timezone, date);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: IBookingRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await bookingService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public reSchedule = async (
    req: Request & {payload: IReScheduleBookingRequest},
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const {id} = req.params;
    const response = await bookingService.reSchedule(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public cancel = async (req: Request, toolkit: ResponseToolkit) => {
    const {id} = req.params;
    const response = await bookingService.cancel(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
