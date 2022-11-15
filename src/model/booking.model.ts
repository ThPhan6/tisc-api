import Model from "@/Database/Model";
import {IBookingAttributes} from '@/types';

export default class BookingModel extends Model<IBookingAttributes> {
  protected table = 'bookings';
  protected softDelete = true;
}
