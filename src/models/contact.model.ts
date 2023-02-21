import { IContactAttributes } from "@/types/contact.type";
import Model from "@/Database/Model";

export const CONTACT_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  email: null,
  inquiry: null,
  created_at: null,
  is_deleted: false,
};

export default class ContactModel extends Model<IContactAttributes> {
  protected table = "contacts";
  protected softDelete = true;
}
