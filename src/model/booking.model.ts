import Model from "@/Database/Model";
import {SlotTime, Timezones} from '@/api/booking/booking.type';

export interface BookingAttributes {
    id: string;
    brand_id: string;
    website: string;
    event_id: string;
    meeting_url: string;
    email: string;
    name: string;
    date: string;
    slot: SlotTime,
    timezone: Timezones;
    created_at: string;
    updated_at: string;
}

export default class BookingModel extends Model<BookingAttributes> {
  protected table = 'bookings';
  protected softDelete = true;
}
