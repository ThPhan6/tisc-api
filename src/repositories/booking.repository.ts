import BookingModel from "@/model/booking.model";
import BaseRepository from "./base.repository";
import { BookingAttributes } from "@/model/booking.model";

class BookingRepository extends BaseRepository<BookingAttributes> {
  protected model: BookingModel;
  protected DEFAULT_ATTRIBUTE: Partial<BookingAttributes> = {
    brand_id: "",
    event_id: "",
    meeting_url: "",
    email: "",
    name: "",
    date: "",
  };

  constructor() {
    super();
    this.model = new BookingModel();
  }
}

export default BookingRepository;
export const bookingRepository = new BookingRepository();
