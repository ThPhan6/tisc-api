import { Request, ResponseToolkit } from "@hapi/hapi";
import { bookingService } from "./booking.service";
import { IBookingRequest } from "./booking.type";

export default class BookingController {
  public availableSchedule = async (req: Request, toolkit: ResponseToolkit) => {
    const {timezone, date} = req.query;
    const response = bookingService.availableSchedule({timezone, date});
    return toolkit.response(response).code(response?.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: IBookingRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await bookingService.create(payload);
    return toolkit.response(response).code(200);
  };

  public reSchedule = async (req: Request, toolkit: ResponseToolkit) => {
    return [];
    // const response:ResponseToolkit = []
    // return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public cancel = async (req: Request, toolkit: ResponseToolkit) => {
    return [];
    // const response:ResponseToolkit = []
    // return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
