import { Request, ResponseToolkit } from "@hapi/hapi";
import { bookingService } from "./booking.service";
import { BookingPayloadRequest } from "./booking.type";

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
}
