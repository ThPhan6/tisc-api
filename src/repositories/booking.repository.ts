import BookingModel from "@/model/booking.model";
import BaseRepository from "./base.repository";
import {
  IBookingAttributes
} from "@/types";

class BookingRepository extends BaseRepository<IBookingAttributes> {
  protected model: BookingModel;
  protected DEFAULT_ATTRIBUTE: Partial<IBookingAttributes> = {
    brand_id: "",
    event_id: "",
    meeting_url: "",
    email: "",
    full_name: "",
    date: "",
    start_time: "",
    end_time: "",
    timezone: "",
    created_at: "",
    updated_at: "",
  };

  constructor() {
    super();
    this.model = new BookingModel();
  }
}

export default BookingRepository;
export const bookingRepository = new BookingRepository();
