import { IContactAttributes } from "./../api/contact/contact.type";
import Model from "./index";

export default class ContactModel extends Model<IContactAttributes> {
  constructor() {
    super("contacts");
  }
}
