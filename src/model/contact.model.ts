import { IContactAttributes } from "./../api/contact/contact.type";
import Model from "./index";

export const CONTACT_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  email: null,
  inquiry: null,
  created_at: null,
};
export default class ContactModel extends Model<IContactAttributes> {
  constructor() {
    super("contacts");
  }
}
